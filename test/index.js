'use strict';

// const co = require('co');
const SDK = require('../lib');

const sdk = new SDK({
  ips: [ 'seed1.bumotest.io:26002' ],
  gasPrice: 1000,
  feeLimit: 10000000,
});
