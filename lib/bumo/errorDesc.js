'use strict';

module.exports = {
  SUCCESS: {
    code: 0,
    msg: 'Success',
  },
  INVALID_PRIVATE_KEY: {
    code: 1,
    msg: 'Invalid private key',
  },
  INVALID_PUBLIC_KEY: {
    code: 2,
    msg: 'Invalid public key',
  },
  INVALID_ADRESS: {
    code: 3,
    msg: 'Invalid adress',
  },
  NOT_ENOUGH_WEIGHT: {
    code: 93,
    msg: 'Not enough weight',
  },
  ERRCODE_INVALID_ADDRESS: {
    code: 94,
    msg: 'errcode_invalid_address',
  },
  ERRCODE_ACCOUNT_LOW_RESERVE: {
    code: 100,
    msg: 'Account low reserve',
  },
  FAIL: {
    code: 10000,
    msg: 'Fail',
  },
  TRANSACTION_FAIL: {
    code: 20000,
    msg: 'Transaction fail',
  },
  ACCOUINT_NO_EXIST: {
    code: 20001,
    msg: 'Accouint no exist',
  },
  INVALID_ACCOUNT_ADDRESS: {
    code: 20002,
    msg: 'Invalid account address',
  },
  INVALID_ACCOUNT_PRIVATE_KEY: {
    code: 20003,
    msg: 'Invalid account private key',
  },
};
