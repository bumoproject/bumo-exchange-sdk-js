'use strict';

const wrap = require('co-wrap-all');
const { keypair, signature } = require('bumo-encryption');
const long = require('long');
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
  this.bumo = bumoSDK;
}

/**
 * prototype
 */
const proto = Wallet.prototype;

proto.getTransactionHistory = function* (options = {}) {
  try {
    const res = yield this._util.get('getTransactionHistory', options);
    if (res.error_code === 0) {
      return this._util.responseData(res.result);
    }

    if (res.error_code === 4) {
      return this._util.responseError(errorDesc.QUERY_RESULT_NOT_EXIST, res.result);
    }

    return this._util.responseError(errorDesc.FAIL);
  } catch (err) {
    throw err;
  }
};

proto.sendBu = function* (params) {
  try {
    const { senderPrivateKey, receiverAddress, amount, nonce, gasPrice, feeLimit } = params;

    if (typeof senderPrivateKey === 'undefined' ||
      typeof receiverAddress === 'undefined' ||
      typeof amount === 'undefined' ||
      typeof nonce === 'undefined') {
      return this._util.responseError(errorDesc.INVALID_NUMBER_OF_ARGS);
    }

    if (!this._util.verifyValue(amount) || !this._util.verifyValue(nonce)) {
      return this._util.responseError(errorDesc.INVALID_FORMAT_OF_ARG);
    }

    if (typeof gasPrice !== 'undefined') {
      if (!this._util.verifyValue(gasPrice)) {
        return this._util.responseError(errorDesc.INVALID_FORMAT_OF_ARG);
      }
      if (long.fromValue(gasPrice).lessThan(long.fromValue(this.options.gasPrice))) {
        return this._util.responseError(errorDesc.gas_price_less_than_default);
      }
    }

    if (typeof feeLimit !== 'undefined') {
      if (!this._util.verifyValue(feeLimit)) {
        return this._util.responseError(errorDesc.INVALID_FORMAT_OF_ARG);
      }
    }

    if (!keypair.checkEncPrivateKey(senderPrivateKey)) {
      return this._util.responseError(errorDesc.INVALID_PRIVATE_KEY);
    }

    if (!keypair.checkAddress(receiverAddress)) {
      return this._util.responseError(errorDesc.INVALID_ADDRESS);
    }

    const seqInfo = yield this.bumo.getBlockNumber();
    const seq = seqInfo.data.seq;
    // Get sender keypair by privateKey
    const senderKeyPair = yield this._util.getKeyPairByPrivateKey(senderPrivateKey);

    const opPayCoin = new chainPb.OperationPayCoin();
    opPayCoin.setDestAddress(receiverAddress);
    opPayCoin.setAmount(long.fromValue(amount));
    const op = new chainPb.Operation();
    op.setType(chainPb.Operation.Type.PAY_COIN);
    op.setPayCoin(opPayCoin);

    const tx = new chainPb.Transaction();
    tx.setSourceAddress(senderKeyPair.address);
    tx.setGasPrice(long.fromValue(gasPrice || this.options.gasPrice).toInt());
    tx.setFeeLimit(long.fromValue(feeLimit || this.options.feeLimit));
    tx.setNonce(long.fromValue(nonce).toInt());
    tx.setCeilLedgerSeq(seq + 50);
    tx.addOperations(op);
    const blob = Buffer.from(tx.serializeBinary()).toString('hex');
    const signData = signature.sign(tx.serializeBinary(), senderKeyPair.privateKey);
    const postData = yield this._util.postData(blob, signData, senderKeyPair.publicKey);
    const result = yield this._util.submitTransaction(postData);
    return result;
  } catch (error) {
    throw error;
  }
};


wrap(proto);
