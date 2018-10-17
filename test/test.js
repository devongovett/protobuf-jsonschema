var compile = require('../');
var assert = require('assert');

describe('protobuf-jsonschema', function() {
  it('should generate a json schema for all messages', function() {
    var opt = {}
    assert.deepEqual(compile(__dirname + '/test.proto', opt), require('./test.json'));
  });
  
  it('should generate a json schema for a single message', function() {
    var defs = require('./test.json').definitions;
    var opt = {model: 'Parent'}
    assert.deepEqual(compile(__dirname + '/test.proto', opt), {
      definitions: {
        Parent: defs.Parent,
        'Parent.Child': defs['Parent.Child']
      }
    });
  });

  it('should disallow additional properties.', function() {
    var defs = require('./test.json').definitions;
    var opt = {additionalProperties: false}
    assert.deepEqual(compile(__dirname + '/test.proto', opt),
        require('./test_no_additional_properties.json'));
  });
});
