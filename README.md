bumo-exchange-sdk
=======

## bumo-exchange-sdk  Installation
```
npm install bumo-exchange-sdk --save
```

## bumo-exchange-sdk  Test
```
npm test
```

## bumo-exchange-sdk  Usage

```js
'use strict';

const { keypair } = require('bumo-encryption');
const BumoSDK = require('../index');

const bumo = new BumoSDK({
  ips: [ 'seed1.bumotest.io:26002' ],
});

// create account
bumo.account.create().then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});

// Get account balance
bumo.account.getBalance('buQXz2qbTb3yx2cRyCz92EnaUKHrwZognnDw').then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});

// Get account info
bumo.account.getInfo('buQXz2qbTb3yx2cRyCz92EnaUKHrwZognnDw').then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});

// Get transaction history
bumo.wallet.getTransactionHistory({ ledgerSeq: 100 }).then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});

// sendBu
const from = 'privbs1NhRnS64Gy4eLNYfJDFAsZNCdNWqg8dNCxze26wtQLEQ1d1gnR';
const to = 'buQgE36mydaWh7k4UVdLy5cfBLiPDSVhUoPq';
const amount = 0.1;
const nonce = 121;

const respParams = {
  from,
  amount,
  to,
  nonce,
};

 bumo.wallet.sendBu(respParams).then(data => {
   console.log(data);
 }).catch(err => {
   console.log(err.message);
 });


```

## License

[MIT](LICENSE)
