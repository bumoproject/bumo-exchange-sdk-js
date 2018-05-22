'use strict';

/**
 * Module dependencies.
 */
const wrap = require('co-wrap-all');
const axios = require('axios');
const { keypair } = require('bumo-encryption');
// const errorDesc = require('./errorDesc');

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
    // return this.sendError(errorDesc.INVALID_PRIVATE_KEY);
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
    throw new Error(err);
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
    throw new Error(err);
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
    return res;
  } catch (err) {
    throw new Error(err);
  }

};

proto.sendData = function(data) {
  const error_code = 0;
  const msg = 'Success';
  return {
    error_code,
    msg,
    data,
  };
};

proto.sendError = function(message) {
  if (!message) {
    throw new Error('require message');
  }
  const error_code = message.code;

  return {
    error_code,
    msg: message.msg,
    data: '',
  };
};

wrap(proto);
