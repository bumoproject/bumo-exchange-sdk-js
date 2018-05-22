'use strict';

/**
 * Module dependencies.
 */
const wrap = require('co-wrap-all');
const errors = require('./bumo/errors');
const Account = require('./bumo/account');
const Wallet = require('./bumo/wallet');
const errorDesc = require('./bumo/errorDesc');
// const merge = require('merge-descriptors');

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

proto.getTransaction = function* (transactionHash) {
  try {
    if (transactionHash === '') {
      return {
        error_code: errorDesc.ARG_CAN_NOT_BE_EMPTY.code,
        msg: errorDesc.ARG_CAN_NOT_BE_EMPTY.msg,
        data: '',
      };
    }

    if (!transactionHash) {
      return {
        error_code: errorDesc.INVALID_NUMBER_OF_ARGS.code,
        msg: errorDesc.INVALID_NUMBER_OF_ARGS.msg,
        data: '',
      };
    }

    if (typeof transactionHash !== 'string') {
      return {
        error_code: errorDesc.INVALID_TYPE_OF_ARG.code,
        msg: errorDesc.INVALID_TYPE_OF_ARG.msg,
        data: '',
      };
    }

    const result = yield this.wallet.getTransactionHistory({ hash: transactionHash });
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

proto.getBlock = function* (blockNumber) {
  try {
    if (typeof blockNumber !== 'number') {
      return {
        error_code: errorDesc.INVALID_TYPE_OF_ARG.code,
        msg: errorDesc.INVALID_TYPE_OF_ARG.msg,
        data: '',
      };
    }

    if (!blockNumber) {
      return {
        error_code: errorDesc.INVALID_NUMBER_OF_ARGS.code,
        msg: errorDesc.INVALID_NUMBER_OF_ARGS.msg,
        data: '',
      };
    }

    const result = yield this.wallet.getTransactionHistory({ ledger_seq: blockNumber });
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

// proto.sendBu = function* (from, to, amount, gasPrice, feeLimit, nonce) {
proto.sendBu = function* (from, to, amount, nonce, gasPrice, feeLimit) {
  try {
    const options = {
      from,
      to,
      amount,
      nonce,
      gasPrice,
      feeLimit,
    };
    const result = yield this.wallet.sendBu(options);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

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
