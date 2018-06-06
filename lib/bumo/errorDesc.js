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
  INVALID_ADDRESS: {
    code: 3,
    msg: 'Invalid address',
  },
  ACCOUNT_NOT_EXIST: {
    code: 4,
    msg: 'Account not exist',
  },
  TRANSACTION_FAIL: {
    code: 5,
    msg: 'Transaction fail',
  },
  NONCE_TOO_SMALL: {
    code: 6,
    msg: '`nonce` too small',
  },
  NOT_ENOUGH_WEIGHT: {
    code: 7,
    msg: 'Not enough weight',
  },
  INVALID_NUMBER_OF_ARGS: {
    code: 8,
    msg: 'Invalid number of arguments to the function',
  },
  INVALID_TYPE_OF_ARG: {
    code: 9,
    msg: 'Invalid type of argument to the function',
  },
  ARG_CAN_NOT_BE_EMPTY: {
    code: 10,
    msg: 'Argument cannot be empty',
  },
  INTERNAL_ERROR: {
    code: 11,
    msg: 'Internal Server Error',
  },
  NONCE_INCORRECT: {
    code: 12,
    msg: 'Nonce incorrect',
  },
  BU_IS_NOT_ENOUGH: {
    code: 13,
    msg: 'BU is not enough',
  },
  SOURCEDEST_EQUAL: {
    code: 14,
    msg: 'Source address equal to dest address',
  },
  DEST_ACCOUNT_EXISTS: {
    code: 15,
    msg: 'Dest account already exists',
  },
  FEE_NOT_ENOUGH: {
    code: 16,
    msg: 'Fee not enough',
  },
  QUERY_RESULT_NOT_EXIST: {
    code: 17,
    msg: 'query result not exist',
  },
  DISCARD_TRANSACTION: {
    code: 18,
    msg: 'Discard transaction, because of lower fee  in queue',
  },
  // ASSERTION_FAILED
  INVALID_ARGUMENTS: {
    code: 19,
    msg: 'Include invalid arguments',
  },
  FAIL: {
    code: 20,
    msg: 'Fail',
  },
  gas_price_less_than_default: {
    code: 21,
    msg: 'Gas price is less than default value',
  },
  INVALID_FORMAT_OF_ARG: {
    code: 22,
    msg: 'Invalid format of argument to the function',
  },
};
