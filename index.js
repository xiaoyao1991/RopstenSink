#!/usr/bin/env node

const program = require('commander');

program
    .arguments('<address>')
    .arguments('<numEthers>')
    .action(function(file) {
      console.log('user: %s pass: %s file: %s',
      program.username, program.password, file);
    })
    .parse(process.argv);
