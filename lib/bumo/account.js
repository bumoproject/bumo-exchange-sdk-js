'use strict';

const wrap = require('co-wrap-all');
const { keypair } = require('bumo-encryption');
const Util = require('./util');
const errors = require('./errors');

/**
 * Expose `Account`
 */
module.exports = Account;

function Account(bumoSDK) {
  this._util = new Util(bumoSDK.options);
}

/**
 * prototype
 */
const proto = Account.prototype;

/**
 * Create account
 * @return {Object} []
 */
proto.create = function create() {
  return keypair.getKeyPair();
};

/**
 * get account balance
 * @param  {String} address [account address]
 * @return {Promise}         []
 */
proto.getBalance = function* (address) {
  const result = yield this.getInfo(address);
  if (result) {
    return { balance: result.balance };
  }
  return { balance: '' };
};


/**
 * Get account information
 * @param  {String}    address [address]
 * @return {Promise}           []
 */
proto.getInfo = function* (address) {
  const res = yield this._util.get('getAccount', { address });

  if (res.error_code !== 0) {
    throw errors.getDesc(res.error_code);
  }

  const result = {};
  result.error_code = 0;
  result.address = res.result.address;
  result.balance = res.result.balance;
  result.isActive = res.result.activated;
  result.nonce = res.result.nonce;
  return result;
};

wrap(proto);
