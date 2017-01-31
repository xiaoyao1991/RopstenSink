#!/usr/bin/env node

const program = require('commander');
const RopstenFaucet = require('./src/faucetApi').RopstenFaucet;

program
  .arguments('<address> <numEthers> <httpProvider>')
  .option("-v, --verbose", "verbose mode")
  .action(function(address, numEthers, httpProvider) {
    var faucet = new RopstenFaucet(httpProvider, program.verbose);
    faucet.sendEthers(address, numEthers);
  })
  .parse(process.argv);
