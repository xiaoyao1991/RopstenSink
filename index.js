#!/usr/bin/env node

const program = require('commander');
const RopstenFaucet = require('./src/faucetApi').RopstenFaucet;

program
    .arguments('<address> <numEthers> <httpProvider>')
    .action(function(address, numEthers, httpProvider) {
      var faucet = new RopstenFaucet(httpProvider);
      faucet.sendEthers(address, numEthers);
    })
    .parse(process.argv);
