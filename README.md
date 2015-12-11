# protobuf-jsonschema

Compiles Protocol Buffer IDL to JSON Schema definitions

## Usage

You can use `protobuf-jsonschema` as a command line tool, or as a function in node.

The CLI can output JSON or YAML (e.g. for Swagger). If you specify a protobuf message
name along with a file, it will output just that message and all dependencies. Otherwise,
it will output all messages.

```shell
$ protobuf-jsonschema --help

  Usage: protobuf-jsonschema [options] <file> [model]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -f, --format [format]  output format: json or yaml [json]
```

In node, `protobuf-jsonschema` exports a single function that returns an object
with the JSON Schema model.

```javascript
var compile = require('protobuf-jsonschema');

var all = compile('models.proto');
var single = compile('models.proto', 'MyModel');
```

## License

MIT
