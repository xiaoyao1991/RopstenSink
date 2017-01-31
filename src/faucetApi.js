var request = require('superagent');
var Web3 = require('web3');
var Promise = require('promise');

function RopstenFaucet(httpProvider, verbose) {
  this.ENDPOINT_PREFIX = "http://faucet.ropsten.be:3001/donate/";
  this.DRIP_RATE = 7000;
  this.web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));
  this.verbose = verbose
}

RopstenFaucet.prototype.sendOneEther = function(address) {
  var _this = this;
  return new Promise(function(fulfill, reject){
    request
      .get(_this.ENDPOINT_PREFIX + address)
      .end(function(err, resp) {
        if (err) {
          console.error("Error sending ether: ", err);
          reject(err);
        } else if (resp.body.amount > 0) {
          console.log("Sending ether to %s...", address);
          fulfill();
        } else {
          console.log("What happened?! ", resp.body);
          reject(resp.body);
        }
      });
  });
}

RopstenFaucet.prototype.sendEthers = function(address, numEthers) {
  var _this = this;
  for (var i=0; i<numEthers; i++) {
    var newAccount = this.web3.personal.newAccount("");
    var donateFn = function(account) {
      return function() {
        _this.sendOneEther(account)
        .then(function(){
          return _this.waitForDonationToSettle(account);
        })
        .then(function(){
          return _this.funnel(account, address);
        });
      }
    };
    console.log("Scheduled to ask for 1 ether to %s in %s", newAccount, i*this.DRIP_RATE);
    setTimeout(donateFn(newAccount), i*_this.DRIP_RATE+1);
  }
}

RopstenFaucet.prototype.funnel = function(from, to) {
  console.log("Funneling 1 ether from %s to %s", from, to);
  this.web3.personal.unlockAccount(from, "");
  return this.web3.eth.sendTransaction({
    from: from,
    to: to,
    value: this.web3.toWei(0.9, "ether")
  });
}

RopstenFaucet.prototype.waitForDonationToSettle = function(address) {
  var _this = this;
  var fn = function(fulfill) {
    if (_this.verbose) {
      console.log("Waiting for the 1 ether donation to %s to settle...", address);
    }

    if (_this.web3.eth.getBalance(address).toNumber() < _this.web3.toWei(1, "ether")) {
      setTimeout(function() {fn(fulfill);}, 5000);
    } else {
      if (_this.verbose) {
        console.log("1 ether donation has arrived at %s", address);
      }
      fulfill();
    }
  }

  return new Promise(function(fulfill, reject){
    fn(fulfill);
  });
}

module.exports = RopstenFaucet;
