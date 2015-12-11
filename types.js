const MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
const MIN_SAFE_INTEGER = -MAX_SAFE_INTEGER;

module.exports = {
  bytes: {
    type: 'string'
  },
  string: {
    type: 'string'
  },
  bool: {
    type: 'boolean'
  },
  int32: {
    type: 'integer',
    minimum: -0x80000000,
    maximum: 0x7fffffff
  },
  sint32: {
    type: 'integer',
    minimum: -0x80000000,
    maximum: 0x7fffffff
  },
  uint32: {
    type: 'integer',
    minimum: 0,
    maximum: 0xffffffff
  },
  int64: {
    type: 'integer',
    minimum: MIN_SAFE_INTEGER,
    maximum: MAX_SAFE_INTEGER
  },
  sint64: {
    type: 'integer',
    minimum: MIN_SAFE_INTEGER,
    maximum: MAX_SAFE_INTEGER
  },
  uint64: {
    type: 'integer',
    minimum: 0,
    maximum: MAX_SAFE_INTEGER
  },
  fixed32: {
    type: 'number',
  },
  fixed64: {
    type: 'number',
  },
  sfixed32: {
    type: 'number',
  },
  sfixed64: {
    type: 'number',
  },
  float: {
    type: 'number',
  },
  double: {
    type: 'number',
  }
};
