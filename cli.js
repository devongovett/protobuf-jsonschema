#!/usr/bin/env node

var commander = require('commander');
var compile = require('./');
var yaml = require('js-yaml');

commander
  .version(require('./package.json').version)
  .arguments('<file> [model]')
  .option('-f, --format [format]', 'output format: json or yaml [json]', 'json')
  .option('-a, --allow [allow]', 'allow additional properties: true or false', 'true')
  .action(function(file, model) {
    var format = commander.format || 'json';
    var opts = { allow_additional_props : !(commander.allow == 'false') };
    var result = compile(opts, file, model);
    
    if (format === 'json')
      process.stdout.write(JSON.stringify(result, false, 2) + '\n');
    else if (format === 'yaml')
      process.stdout.write(yaml.dump(result, { noRefs: true }));
  })
  .parse(process.argv);
