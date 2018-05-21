'use strict';

// const co = require('co');
const BumoSDK = require('../index.js');

const bumo = new BumoSDK({
  ips: [ 'seed1.bumotest.io:26002' ],
});

// bumo.account.test('privbxyL5ULrCDCjF4r3xNekNT4bpABEKMKioeqP3rEbqTQXDWHeUttg');
// bumo.account.test('privbUdN8PY9JA61YACMEswGh2sXkRH8o4WaJTfX2hLDeQ9mLTYydoRi');
// bumo.account.create().then(data => {
//   console.log(data);
// });

// bumo.account.getBalance('buQeZjdQLCoBCwbVYFnMvXByjMDYm9Hwhkgv').then(data => {
//   console.log(data);
// });
//
// bumo.account.getBalance('buQtGi7QmaiaMDygKxMAsKPyLicYjPV2xKVq').then(data => {
//   console.log(data);
// });
// bumo.wallet.getTransactionHistory({ ledgerSeq: 100 }).then(data => {
//   console.log(data);
// });
//
// bumo.account.getInfo('buRXAWseAuRroUTy7u1HJVcv4mBfvrJZHpYf').then(data => {
//   console.log(data);
// });
//

// try {
//
//   // const from = 'privbxyL5ULrCDCjF4r3xNekNT4bpABEKMKioeqP3rEbqTQXDWHeUttg';
//   // const to = 'buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1';
//   // const amount = 0.1;
//
//   const from = 'privbs1NhRnS64Gy4eLNYfJDFAsZNCdNWqg8dNCxze26wtQLEQ1d1gnR';
//   const to = 'buQgE36mydaWh7k4UVdLy5cfBLiPDSVhUoPq';
//   const amount = 0.1;
//
//   const respParams = {
//     from,
//     amount,
//     to,
//   };
//   bumo.wallet.sendBu(respParams).then(data => {
//     console.log(data);
//   }).catch(err => {
//     console.log('++++++++++++');
//     console.log(err);
//     console.log('++++++++++++');
//   });
// } catch (err) {
//   console.log('111111111111');
//   console.log(err);
//   console.log('111111111111');
// }

try {
  bumo.account.create().then(data => {
    console.log(data);
  });
} catch (err) {
  console.log(err);
}
