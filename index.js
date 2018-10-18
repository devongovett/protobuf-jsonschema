var parseSchema = require('../protocol-buffers-schema');
var primitive = require('./types');
var fs = require('fs');
var path = require('path');

function Compiler(filename, additionalProperties, paths) {
  this.messages = {};
  this.enums = {};
  this.schema = this.open(filename);
  if (typeof additionalProperties === 'undefined') {
    this.additionalProperties = true;
  } else {
    this.additionalProperties = additionalProperties;
  }

  if (typeof paths === 'undefined') {
    this.protoPaths = [];
  } else {
    this.protoPaths = paths;
  }
}

Compiler.prototype.open = function(filename, additionalPaths=[]) {
  if (!/\.proto$/i.test(filename) && !fs.existsSync(filename)) {
    filename += '.proto';
  }

  // Try to locate proto files under additional paths.
  if (!fs.existsSync(filename)) {
    for (let i in additionalPaths) {
      if (fs.existsSync(path.resolve(additionalPaths[i], filename))) {
        filename = path.resolve(additionalPaths[i], filename);
        break;
      }
    }
  }

  var schema = parseSchema(fs.readFileSync(filename, 'utf-8'));
  this.visit(schema, schema.package || '');
  
  schema.imports.forEach(function(i) {
    paths = [path.dirname(filename)]
      .concat(additionalPaths)
      .concat(['/usr/local/include/']);
    this.open(i, paths);
  }, this);
  
  return schema;
};

/**
 * Visits a schema in the tree, and assigns messages and enums to the lookup tables.
 */
Compiler.prototype.visit = function(schema, prefix) {
  if (schema.enums) {
    schema.enums.forEach(function(e) {
      e.id = prefix + (prefix ? '.' : '') + (e.id || e.name);
      this.enums[e.id] = e;
      this.visit(e, e.id);
    }, this);
  }
  
  if (schema.messages) {
    schema.messages.forEach(function(m) {
      m.id = prefix + (prefix ? '.' : '') + (m.id || m.name);
      this.messages[m.id] = m;
      this.visit(m, m.id);
    }, this);
  }
};

/**
 * Top level compile method. If a type name is provided,
 * compiles just that type and its dependencies. Otherwise,
 * compiles all types in the file.
 */
Compiler.prototype.compile = function(type) {
  this.root = {
    definitions: {},
    used: {}
  };
  
  if (type) {
    this.resolve(type, '');
  } else {
    this.schema.messages.forEach(function(message) {
      this.resolve(message.id, '');
    }, this);
    
    this.schema.enums.forEach(function(e) {
      this.resolve(e.id, '');
    }, this);
  }
  
  delete this.root.used;
  return this.root;
};

/**
 * Resolves a type name at the given path in the schema tree.
 * Returns a compiled JSON schema.
 */
Compiler.prototype.resolve = function(type, from, base, key) {
  if (primitive[type])
    return primitive[type];
  
  var lookup = from.split('.');
  for (var i = lookup.length; i >= 0; i--) {
    var id = lookup.slice(0, i).concat(type).join('.');
  
    // If this type was used before, move it from inline to a reusable definition
    if (this.root.used[id] && !this.root.definitions[id]) {
      var k = this.root.used[id];
      this.root.definitions[id] = k[0][k[1]];
      k[0][k[1]] = { $ref: '#/definitions/' + id };
    }
  
    // If already defined, reuse
    if (this.root.definitions[id])
      return { $ref: '#/definitions/' + id };
  
    // Compile the message or enum
    var res;
    if (this.messages[id])
      res = this.compileMessage(this.messages[id]);
  
    if (this.enums[id])
      res = this.compileEnum(this.enums[id]);
  
    if (res) {
      // If used, or at the root level, make a definition
      if (this.root.used[id] || !base) {
        this.root.definitions[id] = res;
        res = { $ref: '#/definitions/' + id };
      }
      
      // Mark as used if not an Enum
      if (base && !this.root.used[id] && !this.enums[id])
        this.root.used[id] = [base, key];
    
      return res;
    }
  }
  
  throw new Error('Could not resolve ' + type);
};

/**
 * Compiles and assigns a type
 */
Compiler.prototype.build = function(type, from, base, key) {
  var res = this.resolve(type, from, base, key);
  if (base)
    base[key] = res;
};

/**
 * Compiles a protobuf enum to JSON schema
 */
Compiler.prototype.compileEnum = function(enumType, root) {
  var res = {
    title: enumType.name,
    type: 'string',
    enum: Object.keys(enumType.values)
  };
  
  return res;
};

/**
 * Compiles a protobuf message to JSON schema
 */
Compiler.prototype.compileMessage = function(message, root) {
  var res = {
    title: message.name,
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: this.additionalProperties
  };
  
  message.fields.forEach(function(field) {
    if (field.map) {
      if (field.map.from !== 'string')
        throw new Error('Can only use strings as map keys at ' + message.id + '.' + field.name);
      
      var f = res.properties[field.name] = {
        type: 'object',
        additionalProperties: this.additionalProperties
      };
      
      this.build(field.map.to, message.id, f, 'additionalProperties');
    } else {
      if (field.repeated) {
        var f = res.properties[field.name] = {
          type: 'array',
          items: null
        };
        
        this.build(field.type, message.id, f, 'items');
      } else {
        this.build(field.type, message.id, res.properties, field.name);
      }
    }
    
    if (field.required)
      res.required.push(field.name);
  }, this);
  
  if (res.required.length === 0)
    delete res.required;
  
  return res;
};

module.exports = function(filename, opt) {
  var compiler = new Compiler(filename, opt.additionalProperties, opt.paths);
  return compiler.compile(opt.model);
};
