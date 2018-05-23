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

const BumoSDK = require('bumo-exchange-sdk');

const bumo = new BumoSDK({
  ips: [ 'seed1.bumotest.io:26002' ],
});


bumo.account.create().then(data => {
  console.log(JSON.stringify(data));
}).catch(err => {
  console.log(err.message);
});


bumo.account.getBalance('buQXz2qbTb3yx2cRyCz92EnaUKHrwZognnDw').then(data => {
  console.log(JSON.stringify(data));
}).catch(err => {
  console.log(err.message);
});


bumo.account.getInfo('buQXz2qbTb3yx2cRyCz92EnaUKHrwZognnDw').then(data => {
  console.log(JSON.stringify(data));
}).catch(err => {
  console.log(err.message);
});


bumo.getTransaction('e27d287913dcbe5452d38a567b10f6b73a2a22a2f3c393180ab930286eb8ffd9').then(data => {
  console.log(JSON.stringify(data));
}).catch(err => {
  console.log(err.message);
});


bumo.getBlock(100).then(data => {
  console.log(JSON.stringify(data));
}).catch(err => {
  console.log(err.message);
});


bumo.checkBlockStatus().then(data => {
  console.log(JSON.stringify(data));
}).catch(err => {
  console.log(err.message);
});


const from = 'privbs1NhRnS64Gy4eLNYfJDFAsZNCdNWqg8dNCxze26wtQLEQ1d1gnR';
const to = 'buQgE36mydaWh7k4UVdLy5cfBLiPDSVhUoPq';
const amount = 0.1;
const nonce = 121;

 bumo.sendBu(from, to, amount, nonce).then(data => {
   console.log(JSON.stringify(data));
 }).catch(err => {
   console.log(err.message);
 });

```

## License

[MIT](LICENSE)
