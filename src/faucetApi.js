var request = require('superagent');
var Web3 = require('web3');

function RopstenFaucet(httpProvider) {
  this.ENDPOINT_PREFIX = "http://faucet.ropsten.be:3001/donate/";
  this.DRIP_RATE = 7000;
  this.web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));
}

RopstenFaucet.prototype.sendOneEther = function(address, callback) {
  request
    .get(this.ENDPOINT_PREFIX + address)
    .end(function(err, resp) {
      if (err) {
        console.error("Error sending ether: ", err);
      } else if (resp.body.amount > 0) {
        console.log("Sending ether...");
        callback(address);
      } else {
        console.log("What happened?! ", resp.body);
      }
    });
}

RopstenFaucet.prototype.sendEthers = function(address, numEthers) {
  var _this = this;
  for (var i=0; i<numEthers; i++) {
    var newAccount = this.web3.personal.newAccount("");
    var donateFn = function(account) {
      return function() {
        _this.sendOneEther(account, _this.waitForDonationToSettle(_this.funnel(account, address)));
      }
    };
    console.log("Scheduled to ask for 1 ether to %s in %s", newAccount, i*this.DRIP_RATE);
    setTimeout(donateFn(newAccount), i*_this.DRIP_RATE+1);
  }
}

RopstenFaucet.prototype.funnel = function(from, to) {
  var _this = this;
  return function() {
    console.log("Funneling 1 ether from %s to %s", from, to);
    _this.web3.personal.unlockAccount(from, "");
    return _this.web3.eth.sendTransaction({
      from: from,
      to: to,
      value: _this.web3.toWei(0.9, "ether")
    });
  }
}

RopstenFaucet.prototype.waitForDonationToSettle = function(callback) {
  var _this = this;
  return function(address) {
    console.log("Waiting for the 1 ether donation to %s to settle...", address);
    if (_this.web3.eth.getBalance(address).toNumber() < _this.web3.toWei(1, "ether")) {
      console.log("Account %s hasn't yet received the donation...", address);
      setTimeout(function() {
        _this.waitForDonationToSettle(callback)(address);
      }, 5000);
    } else {
      if (callback) {
        callback();
      }
    }
  }
}

module.exports.RopstenFaucet = RopstenFaucet;
