'use strict';

module.exports = {
  SUCCESS: {
    code: 0,
    msg: 'success',
  },
  INVALID_PRIVATE_KEY: {
    code: 1,
    msg: 'invalid private key',
  },
  INVALID_PUBLIC_KEY: {
    code: 2,
    msg: 'invalid public key',
  },
  INVALID_ADRESS: {
    code: 3,
    msg: 'invalid adress',
  },
  ACCOUNT_NOT_EXIST: {
    code: 4,
    msg: 'account not exist',
  },
  TRANSACTION_FAIL: {
    code: 5,
    msg: 'transaction fail',
  },
  NONCE_TOO_SMALL: {
    code: 6,
    msg: '`nonce` too small',
  },
  NOT_ENOUGH_WEIGHT: {
    code: 7,
    msg: 'not enough weight',
  },
  INVALID_NUMBER_OF_ARGS: {
    code: 8,
    msg: 'invalid number of arguments to the function.',
  },
  INVALID_TYPE_OF_ARG: {
    code: 9,
    msg: 'invalid type of argument to the function.',
  },
  ARG_CAN_NOT_BE_EMPTY: {
    code: 10,
    msg: 'argument cannot be empty',
  },
  INTERNAL_ERROR: {
    code: 11,
    msg: 'internal Server Error',
  },
  NONCE_INCORRECT: {
    code: 12,
    msg: 'nonce incorrect',
  },
  BU_IS_NOT_ENOUGH: {
    code: 13,
    msg: 'BU is not enough',
  },
  SOURCEDEST_EQUAL: {
    code: 14,
    msg: 'source address equal to dest address',
  },
  DEST_ACCOUNT_EXISTS: {
    code: 15,
    msg: 'dest account already exists',
  },
  FEE_NOT_ENOUGH: {
    code: 16,
    msg: 'fee not enough',
  },
  QUERY_RESULT_NOT_EXIST: {
    code: 17,
    msg: 'query result not exist',
  },
  DISCARD_TRANSACTION: {
    code: 18,
    msg: 'Discard transaction, because of lower fee  in queue.',
  },
  // ASSERTION_FAILED
  INVALID_ARGUMENTS: {
    code: 19,
    msg: 'include invalid arguments',
  },
  FAIL: {
    code: 20,
    msg: 'Fail',
  },

};
