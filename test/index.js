'use strict';

// const co = require('co');
const path = require('path');
const SDK = require('../lib');

const sdk = new SDK({
  ips: [ 'seed1.bumotest.io:26002' ],
  gasPrice: 1000,
  feeLimit: 10000000,
});


// Promise style
sdk.test(path.join(__dirname, 'base.proto'), 'AwesomeMessage', {
  awesomeField: 'AwesomeString',
  name: 'leelei',
  email: 'martinlee159@163.com',
  sex: 'MAN',
}).then(data => {
  console.log('#################');
  console.log(data.toString());
  console.log('#################');
}).catch(err => {
  console.log(`${err}`);
});

//
// sdk.test2('getAccountBase', {
//   address: 'buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1',
// }).then(data => {
//   console.log(data);
// }).catch(err => {
//   console.log(`${err}`);
// });


sdk.test2('getAccount', {
  address: 'buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1',
}).then(data => {
  console.log(data);
}).catch(err => {
  console.log(`${err}`);
});
