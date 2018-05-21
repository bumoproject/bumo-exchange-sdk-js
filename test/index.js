'use strict';

// const co = require('co');
const BumoSDK = require('../index.js');

const bumo = new BumoSDK({
  ips: [ 'seed1.bumotest.io:26002' ],
});

bumo.account.getBalance('buQeZjdQLCoBCwbVYFnMvXByjMDYm9Hwhkgv').then(data => {
  console.log(data);
});
bumo.wallet.getTransactionHistory({ ledgerSeq: 100 }).then(data => {
  console.log(data);
});

bumo.account.getInfo('buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1').then(data => {
  console.log(data);
});

const options = {
  from: 'privbxyL5ULrCDCjF4r3xNekNT4bpABEKMKioeqP3rEbqTQXDWHeUttg',
  amount: 1,
  fee: 0.8,
  to: 'buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1',
};

bumo.wallet.sendBu(options).then(data => {
  console.log(data);
}).catch(err => {
  console.log('++++++++++++');
  console.log(err);
  console.log('++++++++++++');
});


// const data = bumo.account.create();
// console.log(data);
