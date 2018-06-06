'use strict';

const path = require('path');
const wrap = require('co-wrap-all');
const { keypair, signature } = require('bumo-encryption');
const long = require('long');
const Util = require('./util');
const errorDesc = require('./errorDesc');
const Account = require('./account');
const protobuf = require("protobufjs");
const tou8 = require('buffer-to-uint8array');

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

    const root = yield protobuf.load(path.join(__dirname, '../protobuf/chain.proto'));

    const payCoin = root.lookupType('protocol.OperationPayCoin');
    const payCoinMsg = payCoin.create({
      destAddress: receiverAddress,
      amount: long.fromValue(amount),
    });

    const operation = root.lookupType('protocol.Operation');
    const operationMsg = operation.create({
      payCoin: payCoinMsg,
      type: operation.Type.PAY_COIN,
    });

    const tx = root.lookupType('protocol.Transaction');
    const payload = {
      sourceAddress: senderKeyPair.address,
      gasPrice: long.fromValue(gasPrice || this.options.gasPrice).toInt(),
      feeLimit: long.fromValue(feeLimit || this.options.feeLimit),
      nonce: long.fromValue(nonce).toInt(),
      ceilLedgerSeq: seq + 50,
      operations: [ operationMsg ],
    };
    const errMsg = tx.verify(payload);

    if (errMsg) {
      throw Error(errMsg);
    }

    const message = tx.create(payload);
    const bufferData = tx.encode(message).finish();
    const uint8ArrayData = tou8(bufferData);

    const blob = bufferData.toString('hex');
    const signData = signature.sign(uint8ArrayData, senderKeyPair.privateKey);
    const postData = yield this._util.postData(blob, signData, senderKeyPair.publicKey);
    return yield this._util.submitTransaction(postData);
  } catch (error) {
    throw error;
  }
};


wrap(proto);
