var compile = require('../');
var assert = require('assert');

describe('protobuf-jsonschema', function() {
  it('should generate a json schema for all messages', function() {
    assert.deepEqual(compile(__dirname + '/test.proto'), require('./test.json'));
  });
  
  it('should generate a json schema for a single message', function() {
    var defs = require('./test.json').definitions;
    assert.deepEqual(compile(__dirname + '/test.proto', 'Parent'), {
      definitions: {
        Parent: defs.Parent,
        'Parent.Child': defs['Parent.Child']
      }
    });
  });
});
