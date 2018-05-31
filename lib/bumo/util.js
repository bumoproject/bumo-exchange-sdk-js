'use strict';

/**
 * Module dependencies.
 */
const wrap = require('co-wrap-all');
const axios = require('axios');
const { keypair } = require('bumo-encryption');
const BigNumber = require('bignumber.js');
const errorDesc = require('./errorDesc');

/**
 * Expose `Util`
 */
module.exports = Util;

function Util(bumoSDK) {
  this.options = bumoSDK || {};
}

/**
 * prototype
 */
const proto = Util.prototype;

/**
 * Get keypair by privateKey
 * @param  {String} privateKey [description]
 * @return {Object}            [description]
 */
proto.getKeyPairByPrivateKey = function(privateKey) {
  if (!keypair.checkEncPrivateKey(privateKey)) {
    // return this.responseError(errorDesc.INVALID_PRIVATE_KEY);
    throw new Error('INVALID_PRIVATE_KEY');
  }
  const publicKey = keypair.getEncPublicKey(privateKey);
  const address = keypair.getAddress(publicKey);
  return {
    privateKey,
    publicKey,
    address,
  };
};

proto.isString = function(object) {
  return typeof object === 'string' || (object && object.constructor && object.constructor.name === 'String');
};

proto.isBigNumber = function(object) {
  return object instanceof BigNumber || (object && object.constructor && object.constructor.name === 'BigNumber');
};

proto.toBigNumber = function(number) {
  number = number || 0;
  if (this.isBigNumber(number)) {
    return number;
  }

  if (this.isString(number) && (number.indexOf('0x') === 0 || number.indexOf('-0x') === 0)) {
    return new BigNumber(number.replace('0x', ''), 16);
  }

  return new BigNumber(number.toString(10), 10);
};

proto.toDecimal = function(value) {
  return this.toBigNumber(value).toNumber();
};

/**
 * Execute `GET` request
 * @param  {String}    uri  [uri]
 * @param  {Object}    data [data for http GET request]
 * @return {Promise}        []
 */
proto.get = function* (uri, data) {
  const url = `http://${this.options.ips[0]}/${uri}`;
  try {
    const res = yield axios.get(url, { params: data });
    const body = res.data;
    return body;
  } catch (err) {
    throw err;
  }
};


/**
 * Execute `POST` request
 * @param  {String}    uri  [uri]
 * @param  {Object}    data [data for http POST request]
 * @return {Promise}        []
 */
proto.post = function* (uri, data) {
  const url = `http://${this.options.ips[0]}/${uri}`;
  try {
    const res = yield axios.post(url, data);
    const body = res.data;
    return body;
  } catch (err) {
    throw err;
  }
};

proto.postData = function(blob, signData, publicKey) {
  const postData = {
    items: [
      {
        transaction_blob: blob,
        signatures: [{
          sign_data: signData,
          public_key: publicKey,
        }],
      },
    ],
  };

  return postData;
};

/**
 * Submit Transaction
 * @param  {Object}    data [data, the type of data is Object]
 * @return {Promise}        []
 */
proto.submitTransaction = function* (data) {
  try {
    const res = yield this.post('submitTransaction', data);
    const results = res.results;
    if (Array.isArray(results) && results.length > 0) {
      const info = results[0];

      switch (info.error_code) {
        case 0:
          return this.responseData({
            hash: info.hash,
          });
        case 93:
          return this.responseError(errorDesc.NOT_ENOUGH_WEIGHT);
        case 99:
          return this.responseError(errorDesc.NONCE_INCORRECT);
        case 100:
          return this.responseError(errorDesc.BU_IS_NOT_ENOUGH);
        case 101:
          return this.responseError(errorDesc.SOURCEDEST_EQUAL);
        case 102:
          return this.responseError(errorDesc.DEST_ACCOUNT_EXISTS);
        case 103:
          return this.responseError(errorDesc.ACCOUNT_NOT_EXIST);
        case 111:
          return this.responseError(errorDesc.FEE_NOT_ENOUGH);
        case 160:
          return this.responseError(errorDesc.DISCARD_TRANSACTION);
        default:
          return this.responseError(errorDesc.TRANSACTION_FAIL);
      }
    }
    return this.responseError(errorDesc.TRANSACTION_FAIL);
  } catch (err) {
    throw new Error(err);
  }

};

proto.responseData = function(data) {
  const error_code = 0;
  const msg = 'Success';
  return {
    error_code,
    msg,
    data,
  };
};

proto.responseError = function(message, data) {
  if (!message) {
    throw new Error('require message');
  }
  const error_code = message.code;

  return {
    error_code,
    msg: message.msg,
    data: data || {},
  };
};

wrap(proto);
