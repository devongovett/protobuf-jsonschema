#!/usr/bin/env node

var commander = require('commander');
var compile = require('./');
var yaml = require('js-yaml');

commander
  .version(require('./package.json').version)
  .arguments('<file> [model]')
  .option('-f, --format [format]', 'output format: json or yaml [json]', 'json')
  .action(function(file, model) {
    var format = commander.format || 'json';
    var result = compile(file, model);
    
    if (format === 'json')
      process.stdout.write(JSON.stringify(result, false, 2) + '\n');
    else if (format === 'yaml')
      process.stdout.write(yaml.dump(result, { dedup: false }));
  })
  .parse(process.argv);
