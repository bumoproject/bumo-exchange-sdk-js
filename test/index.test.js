'use strict';

const co = require('co');
const should = require('chai').should();
const { keypair } = require('bumo-encryption');
const BumoSDK = require('../index');

const bumo = new BumoSDK({
  ips: [ 'seed1.bumotest.io:26002' ],
});


describe('Test bumo-exchange-sdk', function() {

  it('test: account.create', function() {
    bumo.account.create().then(data => {
      const obj = data;
      obj.should.be.a('object');
      obj.should.have.property('error_code');
      obj.should.have.property('msg');
      obj.should.have.property('data');

      obj.data.should.be.a('object');
      obj.data.should.have.property('privateKey');
      obj.data.should.have.property('publicKey');
      obj.data.should.have.property('address');
      obj.data.privateKey.should.be.a('string');
      obj.data.publicKey.should.be.a('string');
      obj.data.address.should.be.a('string');

      const checkPrivateKey = keypair.checkEncPrivateKey(obj.data.privateKey)
      const checkPublickKey = keypair.checkEncPublicKey(obj.data.publicKey)
      const checkAddress = keypair.checkAddress(obj.data.address)
      checkPrivateKey.should.equal(true);
      checkPublickKey.should.equal(true);
      checkAddress.should.equal(true);
    }).catch(err => {
      console.log('++++++++++++');
      console.log(err);
      console.log('++++++++++++');
      // should.not.Throw
    });
  });

  it('test: account.getBalance', function() {
    co(function* () {
      try {
        const info = yield bumo.account.getBalance('buQXz2qbTb3yx2cRyCz92EnaUKHrwZognnDw');
        const account = yield bumo.account.getBalance('buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1')
        info.should.be.a('object');
        info.should.have.property('error_code');
        info.should.have.property('msg');
        info.should.have.property('data');
        info.error_code.should.not.equal(0);
        account.error_code.should.equal(0);
      } catch (err) {
        console.log(err.message);
      }
    }).catch(err => {
      console.log(err.message);
    });
  });

  it('test: account.getInfo', function() {
    co(function* () {
      try {
        const info = yield bumo.account.getInfo('buQXz2qbTb3yx2cRyCz92EnaUKHrwZognnDw');
        const account = yield bumo.account.getInfo('buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1')
        info.should.be.a('object');
        info.should.have.property('error_code');
        info.should.have.property('msg');
        info.should.have.property('data');
        info.error_code.should.not.equal(0);
        account.error_code.should.equal(0);
      } catch (err) {
        console.log(err.message);
      }
    }).catch(err => {
      console.log(err.message);
    });

  });

  it('test: getTransaction', function() {
    const hash = 'e27d287913dcbe5452d38a567b10f6b73a2a22a2f3c393180ab930286eb8ffd9';
    co(function* () {
      try {
        const result = yield bumo.getTransaction(hash);
        // console.log(result);
      } catch (err) {
        console.log(err.message);
      }
    }).catch(err => {
      console.log(err);
    });

  });

  it('test: sendBu', function() {
    co(function* () {
      try {
        const from = 'privbs1NhRnS64Gy4eLNYfJDFAsZNCdNWqg8dNCxze26wtQLEQ1d1gnR';
        const to = 'buQgE36mydaWh7k4UVdLy5cfBLiPDSVhUoPq';
        const amount = 0.1;
        const nonce = 121;

        const data = yield bumo.sendBu(from, to, amount, nonce);

        data.error_code.should.equal(0);

        const from2 = 'privbs1NhRnS64Gy4eLNYfJDFAsZNCdNWqg8dNCxze26wtQLEQ1d1gnR' + 'abc';
        const to2 = 'buQgE36mydaWh7k4UVdLy5cfBLiPDSVhUoPq';
        const amount2 = 0.1;
        const nonce2 = 121;


        const data2 = yield bumo.sendBu(from2, to2, amount2, nonce2);
        data2.error_code.should.not.equal(0);

      } catch (err) {
        console.log(err.message);
      }
    }).catch(err => {
      console.log(err.message);
    });
  });


});
