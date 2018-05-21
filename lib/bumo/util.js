'use strict';

/**
 * Module dependencies.
 */
const wrap = require('co-wrap-all');
const axios = require('axios');
const { keypair } = require('bumo-encryption');

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
    throw Error(err);
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
  const res = yield this.post('submitTransaction', data);
  return res;
};

wrap(proto);
