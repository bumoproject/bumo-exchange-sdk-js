'use strict';

/**
 * Module dependencies.
 */
const wrap = require('co-wrap-all');
const protobufjs = require('protobufjs');
const axios = require('axios');
const { keypair } = require('bumo-demo');

module.exports = Operator;

function Operator(options) {
  this.options = options || {};
}

const proto = Operator.prototype;

/**
 * Transaction execution
 * @param  {Object} options [options, type is object]
 * @return {[Boolean]} [boolean]
 */
proto.tx = options => {
  console.log(options);
  // 根据意愿组装交易对象Transaction
  // 交易对象序列化(protocol buffer 3格式)为字节流 transaction_blob
  // 用私钥skey对transaction_blob签名得到sign_data，skey的公钥为pkey
  // 提交交易，见提交交易
  // 查询以确定交易是否成功或接收推送（websocket API）判断交易是否成功
  console.log('Transaction execution');
  return true;
};

/**
 * Encode protocal buffer file, get an Uint8Array (browser) or Buffer (node)
 * @param  {String}    protoFile      [protocal buffer file or JSON descriptors]
 * @param  {String}    packageMessage [package.message]
 * @param  {Object}    payloadObj     [payload object]
 * @return {Generator}                []
 */
proto.encodeMessage = function* (protoFile, packageMessage, payloadObj) {
  // console.log(this.options);


  const root = yield protobufjs.load(protoFile);

  // Obtain a message type
  const Message = root.lookupType(`${packageMessage}`);

  // Exemplary payload
  const payload = payloadObj;

  // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
  const errMsg = Message.verify(payload);
  if (errMsg) {
    throw Error(errMsg);
  }

  // Create a new message
  const message = Message.create(payload); // or use .fromObject if conversion is necessary

  // Encode a message to an Uint8Array (browser) or Buffer (node)
  const buffer = Message.encode(message).finish();

  return buffer;
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

/**
 * Get keypair by privateKey
 * @param  {String} privateKey [description]
 * @return {Object}            [description]
 */
proto.getKeyPairByPrivateKey = function(privateKey) {
  const publicKey = keypair.getPublicKey(privateKey);
  const address = keypair.getAddress(publicKey);
  return {
    privateKey,
    publicKey,
    address,
  };
};

wrap(proto);
