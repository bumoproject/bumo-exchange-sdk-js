'use strict';

/**
 * Module dependencies.
 */
const wrap = require('co-wrap-all');
const errors = require('./bumo/errors');
const Account = require('./bumo/account');
const Wallet = require('./bumo/wallet');
const Util = require('./bumo/util');
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
  this._util = new Util(this.options);
}

const proto = BUMOSDK.prototype;

proto.getTransaction = function* (transactionHash) {
  try {
    if (transactionHash === '') {
      return this._util.responseError(errorDesc.ARG_CAN_NOT_BE_EMPTY);
    }

    if (!transactionHash) {
      return this._util.responseError(errorDesc.INVALID_NUMBER_OF_ARGS);
    }

    if (typeof transactionHash !== 'string') {
      return this._util.responseError(errorDesc.INVALID_TYPE_OF_ARG);
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
      return this._util.responseError(errorDesc.INVALID_TYPE_OF_ARG);
    }

    if (!blockNumber) {
      return this._util.responseError(errorDesc.INVALID_NUMBER_OF_ARGS);
    }

    const result = yield this.wallet.getTransactionHistory({ ledger_seq: blockNumber });
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

proto.checkBlockStatus = function* () {
  // getModulesStatus
  const data = yield this._util.get('getModulesStatus');
  const info = data.ledger_manager;
  if (info.chain_max_ledger_seq === info.ledger_sequence) {
    return this._util.responseData(true);
  }
  return this._util.responseData(false);
};

proto.getBlockNumber = function* () {
  try {
    const data = yield this._util.get('getLedger');

    if (data && data.error_code === 0) {
      const seq = data.result.header.seq;
      return this._util.responseData({
        seq,
      });
    }

    return this._util.responseError(errorDesc.INTERNAL_ERROR);

  } catch (err) {
    throw err;
  }
};

proto.sendBu = function* (options) {
  try {
    const result = yield this.wallet.sendBu(options);
    return result;
  } catch (err) {
    // throw new Error(err);
    throw err;
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
