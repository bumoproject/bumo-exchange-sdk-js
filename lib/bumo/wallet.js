'use strict';

const wrap = require('co-wrap-all');
const { signature } = require('bumo-encryption');
const Util = require('./util');
const errors = require('./errors');
const Account = require('./account');
const chainPb = require('../protobuf/chain_pb');

/**
 * Expose `Wallet`
 */
module.exports = Wallet;

function Wallet(bumoSDK) {
  this._util = new Util(bumoSDK.options);
  this.account = new Account(bumoSDK);
}

/**
 * prototype
 */
const proto = Wallet.prototype;

proto.sendBu = function* sendBU(params) {
  const { from, to, amount, gasPrice, feeLimit, nonce } = params;
  const privateKey = from;
  // Get sender keypair by privateKey
  const senderKeyPair = yield this._util.getKeyPairByPrivateKey(privateKey);
  // Get sender account info by address
  const senderInfo = yield this.account.getInfo(senderKeyPair.address);

  if (senderInfo.error_code !== 0) {
    // throw new Error('can not get account information by this address');
    throw errors.getDesc(senderInfo.error_code);
  }

  // Transaction Message
  const tx = new chainPb.Transaction();
  tx.setSourceAddress(senderKeyPair.address);
  tx.setGasPrice(gasPrice);
  tx.setFeeLimit(feeLimit);
  tx.setNonce(nonce + 1);
  // OperationPayCoin Message
  const opPayCoin = new chainPb.OperationPayCoin();
  opPayCoin.setDestAddress(to);
  opPayCoin.setAmount(amount * 100000000);
  // Operation Message
  const op = new chainPb.Operation();
  op.setType(chainPb.Operation.Type.PAY_COIN);
  op.setPayCoin(opPayCoin);

  tx.addOperations(op);
  const blob = Buffer.from(tx.serializeBinary()).toString('hex');
  const signData = signature.sign(tx.serializeBinary(), senderKeyPair.privateKey);
  const postData = yield this._util.postData(blob, signData, senderKeyPair.publicKey);
  const result = yield yield this._util.submitTransaction(postData);
  return result;
};

proto.getTransactionHistory = function* (options = {}) {
  const params = {};
  const keys = Object.keys(options);
  keys.forEach(function(key) {
    if (options[key]) {
      params[key] = options[key];
    }
  });

  const res = yield this._util.get('getTransactionHistory', params);

  return res;
};

// proto.getTransaction = function getTransaction(transactionHash) {
//   console.log(transactionHash);
// };

wrap(proto);
