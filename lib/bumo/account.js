'use strict';

const wrap = require('co-wrap-all');
const { keypair, signature } = require('bumo-encryption');
const Util = require('./util');
const errors = require('./errors');
const chainPb = require('../protobuf/chain_pb');

/**
 * Expose `Account`
 */
module.exports = Account;

function Account(bumoSDK) {
  this.options = bumoSDK.options;
  this._util = new Util(this.options);
}

/**
 * prototype
 */
const proto = Account.prototype;

proto.test = function(privateKey) {
  console.log('#################');
  const publicKey = keypair.getEncPublicKey(privateKey);
  const address = keypair.getAddress(publicKey);
  console.log(privateKey);
  console.log(publicKey);
  console.log(address);
  console.log('#################');
};

// Create account
proto.create = function* () {
  const kp = keypair.getKeyPair();
  const privateKey = kp.encPrivateKey;
  const publicKey = kp.encPublicKey;
  const address = kp.address;
  // Transaction Message
  const tx = new chainPb.Transaction();
  tx.setSourceAddress(address);
  tx.setGasPrice(this.options.gasPrice);
  tx.setFeeLimit(this.options.feeLimit);
  tx.setNonce(1);


  // message OperationCreateAccount{
  // 	string dest_address = 1;
  // 	Contract contract = 2;
  // 	AccountPrivilege priv = 3;
  // 	repeated KeyPair metadatas = 4;
  // 	int64	init_balance = 5;
  // 	string  init_input = 6;
  // }

  // message AccountPrivilege {
  // 	int64 master_weight = 1;
  // 	repeated Signer signers = 2;
  // 	AccountThreshold thresholds = 3;
  //
  // }
  //
  // message AccountThreshold{
  // 		 int64 tx_threshold = 1; //required, [-1,MAX(INT64)] -1: ±íÊ¾²»ÉèÖÃ indicate no setting
  // 		 repeated OperationTypeThreshold type_thresholds = 2;  //Èç¹ûÕâ¸öÉèÖÃ£¬Ôò²Ù×÷ÃÅÏÞÒÔÕâ¸öÎª×¼
  // }

  // OperationCreateAccount Message
  const createAccountMsg = new chainPb.OperationCreateAccount();
  createAccountMsg.setDestAddress(address);
  createAccountMsg.setInitBalance(10000000);

  const accountThresholdMsg = new chainPb.AccountThreshold();
  accountThresholdMsg.setTxThreshold = 1;

  const accountPrivilegeMsg = new chainPb.AccountPrivilege();
  accountPrivilegeMsg.setMasterWeight = 1;
  // accountPrivilegeMsg.setAccountThreshold = accountThresholdMsg;
  accountPrivilegeMsg.setThresholds = accountThresholdMsg;

  // console.log('+++++++++++++');
  // console.log(accountPrivilegeMsg);
  // console.log('+++++++++++++');
  // createAccountMsg.addPriv(accountPrivilegeMsg);
  createAccountMsg.setPriv(accountPrivilegeMsg);
  // createAccountMsg.addAccountPrivilege(accountPrivilegeMsg);
  // Operation Message
  const op = new chainPb.Operation();
  op.setType(chainPb.Operation.Type.CREATE_ACCOUNT);
  op.setCreateAccount(createAccountMsg);
  tx.addOperations(op);

  // console.log(tx);
  // return;
  const blob = Buffer.from(tx.serializeBinary()).toString('hex');
  const signData = signature.sign(tx.serializeBinary(), privateKey);
  const postData = yield this._util.postData(blob, signData, publicKey);
  const result = yield yield this._util.submitTransaction(postData);
  // console.log('^^^^^^^^^^^^^');
  // console.log(blob);
  // console.log(signData);
  // console.log(postData);
  // console.log('^^^^^^^^^^^^^');
  // // return { kp, result };
  console.log('*******************');
  console.log(result);
  // console.log(result.result);
  console.log('*******************');
};

/**
 * get account balance
 * @param  {String} address [account address]
 * @return {Object}         []
 */
proto.getBalance = function* (address) {
  const result = yield this.getInfo(address);
  if (result) {
    return { balance: result.balance };
  }
  return { balance: '' };
};


/**
 * Get account information
 * @param  {String}    address [address]
 * @return {Object}           []
 */
proto.getInfo = function* (address) {
  const res = yield this._util.get('getAccount', { address });

  if (res.error_code !== 0) {
    throw errors.getDesc(res.error_code);
  }

  const result = {};
  result.error_code = 0;
  result.address = res.result.address;
  result.balance = res.result.balance;
  result.isActive = res.result.activated;
  result.nonce = res.result.nonce;
  return result;
};

wrap(proto);
