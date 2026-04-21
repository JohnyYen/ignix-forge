#!/usr/bin/env node
const { program } = require('commander')
const list = require('../commands/list')
const init = require('../commands/init')
const get = require('../commands/get')
const create = require('../commands/create')
const deleteCommand = require('../commands/delete')
const update = require('../commands/update')

deleteCommand(program)
update(program)
get(program)
create(program)
init(program)
list(program)

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
