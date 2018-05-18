'use strict';

const wrap = require('co-wrap-all');
const Operator = require('./operator');
const chainPb = require('./protobuf/chain_pb');
// bumo-demo临时测试用，真实环境使用 npm install bumo-encryption 安装
const { signature } = require('bumo-demo');
// const { signature } = require('bumo-encryption');

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
  const { privateKey, amount, destAddress } = params;
  // Get sender keypair by privateKey
  const senderKeyPair = yield this._OPR.getKeyPairByPrivateKey(privateKey);
  // Get sender account info by address
  const senderInfo = yield this.getAccountInfo(senderKeyPair.address);
  if (senderInfo.error_code !== 0) {
    throw new Error('can not get account information by this address');
  }
  // Transaction Message
  const tx = new chainPb.Transaction();
  tx.setSourceAddress(senderKeyPair.address);
  tx.setGasPrice(this.options.gasPrice);
  tx.setFeeLimit(this.options.feeLimit);
  tx.setNonce(senderInfo.nonce + 1);
  // OperationPayCoin Message
  const opPayCoin = new chainPb.OperationPayCoin();
  opPayCoin.setDestAddress(destAddress);
  opPayCoin.setAmount(amount * 100000000);
  // Operation Message
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


wrap(proto);
