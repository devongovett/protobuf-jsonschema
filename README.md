# protobuf-jsonschema

Compiles [Protocol Buffer IDL](https://developers.google.com/protocol-buffers/docs/proto3)
to [JSON Schema](http://json-schema.org) definitions.

## Usage

You can use `protobuf-jsonschema` as a command line tool, or as a function in node.

The CLI can output JSON or YAML (e.g. for Swagger). If you specify a protobuf message
name along with a file, it will output just that message and all dependencies. Otherwise,
it will output all messages.

```shell
$ npm install protobuf-jsonschema -g
$ protobuf-jsonschema --help

  Usage: protobuf-jsonschema [options] <file> [model]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -f, --format [format]  output format: json or yaml [json]
    -a, --allow            true if validator should allow additional properties, false if not. This will apply to all objects in the schema.
```

In node, `protobuf-jsonschema` exports a single function that returns an object
with the JSON Schema model.

```javascript
var compile = require('protobuf-jsonschema');

var all = compile({ allow_additional_props: true }, 'models.proto');
var single = compile({ allow_additional_props: true }, 'models.proto', 'MyModel');
```

## License

MIT
