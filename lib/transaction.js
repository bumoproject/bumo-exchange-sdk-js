'use strict';

const wrap = require('co-wrap-all');
const Operator = require('./operator');
const chainPb = require('./protobuf/chain_pb');
// 此处从npm安装
const { signature } = require('bumo-demo');
module.exports = Transaction;

function Transaction() {
  this._OPR = new Operator(this.options);
}

const proto = Transaction.prototype;

proto.generateKeyPair = function* () {
  console.log('generate key pair');
};


/**
 * Create Account
 * @param  {String}    destAddress [destination address]
 * @param  {int}       initBalance [Initialization balance]
 * @return {Generator}             [description]
 */
proto.createAccount = function* (destAddress, initBalance) {
  // console.log(this.options);
  console.log(destAddress);
  console.log(initBalance);
  return null;
};

/**
 * Get account information
 * @param  {String}    address [address]
 * @return {Promise}           []
 */
proto.getAccountInfo = function* (address) {
  // HTTP GET /getAccount?address=buQs9npaCq9mNFZG18qu88ZcmXYqd6bqpTU3&key=hello&code=xxx&issuer=xxx
  const res = yield this._OPR.get('getAccount', { address });
  if (!res.error_code) {
    return { error_code: 1 };
  }

  const result = {};
  result.error_code = 0;
  result.address = res.address;
  result.balance = res.balance;
  result.isActive = res.activated;
  result.nonce = res.nonce;
  return result;

};

/**
 * Send BU to the destAddress
 * @param  {Object}    params [params is object, include `privateKey`, `amount`, `destAddress`]
 * @return {Promise}          []
 */
proto.sendBu = function* (params) {
  const { privateKey, amount, destAddress, gasPrice, feeLimit } = params;
  // Get sender keypair by privateKey
  const senderKeyPair = yield this._OPR.getKeyPairByPrivateKey(privateKey);
  // Get sender account info by address
  const senderInfo = yield this.getAccountInfo(senderKeyPair.address);
  if (senderInfo.error_code !== 0) {
    throw new Error('can not get account information by this address');
  }

  const tx = new chainPb.Transaction();
  tx.setSourceAddress(senderKeyPair.address);
  tx.setGasPrice(gasPrice || '');
  tx.setFeeLimit(feeLimit || '');
  tx.setNonce(senderInfo.nonce + 1);

  const opPayCoin = new chainPb.OperationPayCoin();
  opPayCoin.setDestAddress(destAddress);
  opPayCoin.setAmount(amount * 100000000);

  const op = new chainPb.Operation();
  op.setType(chainPb.Operation.Type.PAY_COIN);
  op.setPayCoin(opPayCoin);

  tx.addOperations(op);
  const blob = Buffer.from(tx.serializeBinary()).toString('hex');
  const signData = signature.sign(tx.serializeBinary(), senderKeyPair.privateKey);
  const postData = yield this._OPR.postData(blob, signData, senderKeyPair.publicKey);
  const result = yield yield this._OPR.submitTransaction(postData);
  return result;
};


// // For testing
// proto.test = function* (protoFile, packageMessage, payloadObj) {
//   // console.log(this.options);
//   const result = yield this._OPR.encodeMessage(protoFile, packageMessage, payloadObj);
//   return result;
// };
//
//
// proto.test2 = function* (uri, data) {
//   const result = yield this._OPR.get(uri, data);
//   return result;
// };


/**
 * Get ledger information
 * @return {Generator} [description]
 */
proto.getLedger = function* () {
  const result = null;
  return result;
};

wrap(proto);
