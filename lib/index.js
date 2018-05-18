'use strict';

/**
 * Module dependencies.
 */
const wrap = require('co-wrap-all');
const util = require('util');
const Transaction = require('./transaction');


module.exports = SDK;

function SDK(options) {
  if (!(this instanceof SDK)) {
    return new SDK(options);
  }

  if (options && options.inited) {
    this.options = options;
  } else {
    this.options = SDK.initOptions(options);
  }

  Transaction.call(this);
}

util.inherits(SDK, Transaction);

const proto = SDK.prototype;

SDK.initOptions = function initOptions(options) {
  if (!options || !options.ips) {
    throw new Error('require ips');
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
