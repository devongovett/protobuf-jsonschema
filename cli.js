#!/usr/bin/env node

var commander = require('commander');
var compile = require('./');
var yaml = require('js-yaml');
var path = require('path');

commander
  .version(require('./package.json').version)
  .arguments('<file> [model]')
  .option('-f, --format [format]', 'output format: json or yaml [json]', 'json')
  .option('-I, --import [dir]', 'directory to search for imports (repeatable)', collect, [])
  .action(function(file, model) {
    var format = commander.format || 'json';
    var imports = [path.dirname(file)].concat(commander.import);
    var result = compile(file, model, imports);

    if (format === 'json')
      process.stdout.write(JSON.stringify(result, false, 2) + '\n');
    else if (format === 'yaml')
      process.stdout.write(yaml.dump(result, { noRefs: true }));
  })
  .parse(process.argv);

function collect(val, memo) {
  memo.push(val);
  return memo;
}