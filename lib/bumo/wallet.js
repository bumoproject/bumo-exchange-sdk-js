'use strict';

const wrap = require('co-wrap-all');
const { keypair, signature } = require('bumo-encryption');
const Util = require('./util');
// const errors = require('./errors');
const errorDesc = require('./errorDesc');
const Account = require('./account');
const chainPb = require('../protobuf/chain_pb');

/**
 * Expose `Wallet`
 */
module.exports = Wallet;

function Wallet(bumoSDK) {
  this.options = bumoSDK.options;
  this._util = new Util(this.options);
  this.account = new Account(bumoSDK);
}

/**
 * prototype
 */
const proto = Wallet.prototype;

proto.getTransactionHistory = function* (options = {}) {
  const params = {};
  const keys = Object.keys(options);
  keys.forEach(function(key) {
    if (options[key]) {
      params[key] = options[key];
    }
  });

  const res = yield this._util.get('getTransactionHistory', params);
  if (res.error_code !== 0) {
    return this._util.responseError(errorDesc.FAIL);
  }

  return this._util.responseData(res.result);
};

proto.sendBu = function* (params) {
  try {
    const { from, to, amount, nonce, gasPrice, feeLimit } = params;
    if (!from || !to || !amount || !nonce) {
      return this._util.responseError(errorDesc.INVALID_NUMBER_OF_ARGS);
    }

    if (typeof amount !== 'number' || typeof nonce !== 'number') {
      return this._util.responseError(errorDesc.INVALID_TYPE_OF_ARG);
    }

    if (gasPrice || feeLimit) {
      if (typeof gasPrice !== 'number' || typeof feeLimit !== 'number') {
        return this._util.responseError(errorDesc.INVALID_TYPE_OF_ARG);
      }
    }

    if (!keypair.checkEncPrivateKey(from)) {
      return this._util.responseError(errorDesc.INVALID_PRIVATE_KEY);
    }

    if (!keypair.checkAddress(to)) {
      return this._util.responseError(errorDesc.INVALID_ADRESS);
    }
    // `from` is the encPrivateKey
    // Get sender keypair by privateKey
    const senderKeyPair = yield this._util.getKeyPairByPrivateKey(from);
    // Get sender account info by address
    // const senderInfo = yield this.account.getInfo(senderKeyPair.address);
    const tx = new chainPb.Transaction();
    tx.setSourceAddress(senderKeyPair.address);
    tx.setGasPrice(gasPrice || this.options.gasPrice);
    tx.setFeeLimit(feeLimit || this.options.feeLimit);
    tx.setNonce(nonce + 1);

    const opPayCoin = new chainPb.OperationPayCoin();
    opPayCoin.setDestAddress(to);
    opPayCoin.setAmount(amount * 100000000);
    const op = new chainPb.Operation();
    op.setType(chainPb.Operation.Type.PAY_COIN);
    op.setPayCoin(opPayCoin);
    tx.addOperations(op);
    const blob = Buffer.from(tx.serializeBinary()).toString('hex');
    const signData = signature.sign(tx.serializeBinary(), senderKeyPair.privateKey);
    const postData = yield this._util.postData(blob, signData, senderKeyPair.publicKey);
    const result = yield this._util.submitTransaction(postData);
    return result;
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  }
};


wrap(proto);
