'use strict';

const wrap = require('co-wrap-all');
const is = require('is-type-of');
const { keypair } = require('bumo-encryption');
const Util = require('./util');
const errors = require('./errorDesc');

/**
 * Expose `Account`
 */
module.exports = Account;

function Account(bumoSDK) {
  this.options = bumoSDK.options;
  this._util = new Util(this.options);
}

/**
 * prototype
 */
const proto = Account.prototype;

/**
 * Create account
 * @return {object} [return object, include privateKey, publicKey and address]
 */
proto.create = function* () {
  const kp = keypair.getKeyPair();
  const encPrivateKey = kp.encPrivateKey;
  const encPublicKey = kp.encPublicKey;
  const address = kp.address;

  return this._util.responseData({
    privateKey: encPrivateKey,
    publicKey: encPublicKey,
    address,
  });
};

/**
 * get account balance
 * @param  {String} address [account address]
 * @return {Object}         []
 */
proto.getBalance = function* (address) {
  if (!keypair.checkAddress(address)) {
    return this._util.responseError(errors.INVALID_ADRESS);
  }

  const info = yield this.getInfo(address);
  if (info.error_code === 0) {
    return this._util.responseData({
      balance: info.data.balance,
    });
  }

  return this._util.responseError(errors.ACCOUINT_NO_EXIST);
};


/**
 * Get account information
 * @param  {String}    address [address]
 * @return {Object}           []
 */
proto.getInfo = function* (address) {
  if (!keypair.checkAddress(address)) {
    return this._util.responseError(errors.INVALID_ADRESS);
  }
  const res = yield this._util.get('getAccount', { address });

  if (res.error_code !== 0) {
    return this._util.responseError(errors.ACCOUINT_NO_EXIST);
  }

  let nonce = parseInt(res.result.nonce);

  if (is.NaN(nonce)) {
    nonce = 1;
  } else {
    nonce = nonce + 1;
  }

  // return result
  return this._util.responseData({
    address: res.result.address,
    balance: res.result.balance,
    nonce,
    assets: res.result.assets || [],
  });
};


proto.checkAddress = function* (address) {
  if (!keypair.checkAddress(address)) {
    return this._util.responseData(false);
  }
  return this._util.responseData(true);
};


wrap(proto);
