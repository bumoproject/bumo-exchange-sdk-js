'use strict';

/**
 * Module dependencies.
 */
const wrap = require('co-wrap-all');
const errors = require('./bumo/errors');
const Account = require('./bumo/account');
const Wallet = require('./bumo/wallet');

module.exports = BUMOSDK;

function BUMOSDK(options) {
  if (!(this instanceof BUMOSDK)) {
    return new BUMOSDK(options);
  }

  if (options && options.inited) {
    this.options = options;
  } else {
    this.options = BUMOSDK.initOptions(options);
  }

  this.account = new Account(this);
  this.wallet = new Wallet(this);
}

const proto = BUMOSDK.prototype;

BUMOSDK.initOptions = function initOptions(options) {
  if (!options || !options.ips) {
    throw errors.IncompleteParameters();
  }

  const opts = {};

  Object.keys(options).forEach(key => {
    if (options[key] !== undefined) {
      opts[key] = options[key];
    }
  });

  opts.gasPrice = 1000;
  opts.feeLimit = 10000000;

  if (!Array.isArray(opts.ips) || !opts.ips.length) {
    throw new Error('The type of `ips` must be an Array and Its length is greater than 0');
  }

  opts.ips.forEach(ip => {
    if (!ip) {
      throw new Error('ip address is empty');
    }
    const ipArr = ip.split(':');
    if (!ipArr[1]) {
      throw new Error('port is not set, The correct format is: `ip:port`');
    }
  });

  opts.inited = true;
  return opts;
};


wrap(proto);
