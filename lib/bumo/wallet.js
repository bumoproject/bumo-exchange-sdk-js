'use strict';

const wrap = require('co-wrap-all');
const { keypair, signature } = require('bumo-encryption');
const is = require('is-type-of');
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
    // const params = {};
    // const keys = Object.keys(options);
    // keys.forEach(function(key) {
    //   if (options[key]) {
    //     params[key] = options[key];
    //   }
    // });
    //
    // console.log('********');
    // console.log(options);
    // console.log('********');
    const res = yield this._util.get('getTransactionHistory', options);
    // console.log('==================');
    // console.log(res);
    // console.log('==================');
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
    if (!senderPrivateKey || !receiverAddress || !amount || !nonce) {
      return this._util.responseError(errorDesc.INVALID_NUMBER_OF_ARGS);
    }

    // if (typeof amount !== 'number' || typeof nonce !== 'number') {
    //   return this._util.responseError(errorDesc.INVALID_TYPE_OF_ARG);
    // }
    //
    // // amount must be an int.
    // if (amount % 1 !== 0) {
    //   return this._util.responseError(errorDesc.INVALID_TYPE_OF_ARG);
    // }

    if (!is.int(amount) || amount <= 0 || !is.int(nonce) || nonce <= 0) {
      return this._util.responseError(errorDesc.INVALID_TYPE_OF_ARG);
    }

    if (typeof gasPrice !== 'undefined') {
      if (!is.int(gasPrice) || gasPrice <= 0) {
        return this._util.responseError(errorDesc.INVALID_TYPE_OF_ARG);
      }
    }

    if (typeof feeLimit !== 'undefined') {
      if (!is.int(feeLimit) || feeLimit <= 0) {
        return this._util.responseError(errorDesc.INVALID_TYPE_OF_ARG);
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
    const tx = new chainPb.Transaction();
    tx.setSourceAddress(senderKeyPair.address);
    tx.setGasPrice(this._util.toDecimal(gasPrice) || this.options.gasPrice);
    tx.setFeeLimit(this._util.toBigNumber(feeLimit) || this.options.feeLimit);
    tx.setNonce(this._util.toDecimal(nonce));
    tx.setCeilLedgerSeq(seq + 50);

    const opPayCoin = new chainPb.OperationPayCoin();
    opPayCoin.setDestAddress(receiverAddress);
    opPayCoin.setAmount(this._util.toBigNumber(amount));
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
    throw error;
  }
};


wrap(proto);
