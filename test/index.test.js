'use strict';

const co = require('co');
const should = require('chai').should();
const { keypair } = require('bumo-encryption');
const BumoSDK = require('../index');

const bumo = new BumoSDK({
  ips: [ 'seed1.bumotest.io:26002' ],
});


describe('Test bumo-exchange-sdk', function() {
  it('test: account.create', function(done) {
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

      const checkPrivateKey = keypair.checkEncPrivateKey(obj.data.privateKey);
      const checkPublickKey = keypair.checkEncPublicKey(obj.data.publicKey);
      const checkAddress = keypair.checkAddress(obj.data.address);
      checkPrivateKey.should.equal(true);
      checkPublickKey.should.equal(true);
      checkAddress.should.equal(true);
			done();
    }).catch(err => {
      done(err);
    });
  });

  it('test: account.getBalance', function(done) {
    co(function* () {
      try {
        const info = yield bumo.account.getBalance('buQXz2qbTb3yx2cRyCz92EnaUKHrwZognnDw');
        const account = yield bumo.account.getBalance('buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1');
        info.should.be.a('object');
        info.should.have.property('error_code');
        info.should.have.property('msg');
        info.should.have.property('data');
        info.error_code.should.not.equal(0);
        account.error_code.should.equal(0);
				done();
      } catch (err) {
				done(err);
      }
    }).catch(err => {
      done(err);
    });
  });

  it('test: account.getInfo', function(done) {
    co(function* () {
      try {
        const info = yield bumo.account.getInfo('buQXz2qbTb3yx2cRyCz92EnaUKHrwZognnDw');
        // const account = yield bumo.account.getInfo('buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1')
        const account = yield bumo.account.getInfo('buQaKVttFz5wSGWErbCnQteY6qTbSHkTouVr');
        info.should.be.a('object');
        info.should.have.property('error_code');
        info.should.have.property('msg');
        info.should.have.property('data');
        info.error_code.should.not.equal(0);
        account.error_code.should.equal(0);
        done();
      } catch (err) {
				done(err);
      }
    }).catch(err => {
      done(err);
    });

  });

  it('test: getTransaction', function(done) {
    const hash = 'e27d287913dcbe5452d38a567b10f6b73a2a22a2f3c393180ab930286eb8ffd9';
    co(function* () {
      try {
        const result = yield bumo.getTransaction(hash);
        result.error_code.should.equal(0);
				done();
      } catch (err) {
				done(err);
      }
    }).catch(err => {
      done(err);
    });

  });

  it('test: getBlock', function(done) {
    co(function* () {
      try {
        const blockNumber = 100;
        const result = yield bumo.getBlock(blockNumber);
        const blockNumberNotExist = 212534;
        const data = yield bumo.getBlock(blockNumberNotExist);
        result.error_code.should.equal(0);
        data.error_code.should.not.equal(0);
				done();
      } catch (err) {
        done(err);
      }
    }).catch(err => {
      done(err);
    });

  });

  it('test: checkBlockStatus', function(done) {
    co(function* () {
      try {
        const result = yield bumo.checkBlockStatus();
        result.data.should.be.a('boolean');
				done();
      } catch (err) {
        done(err);
      }
    }).catch(err => {
      done(err);
    });

  });

  it('test: getBlockNumber', function(done) {
    co(function* () {
      try {
        const result = yield bumo.getBlockNumber();
        result.data.seq.should.be.a('number');
				done();
      } catch (err) {
        done(err);
      }
    }).catch(err => {
      done(err);
    });

  });

  it('test: account.checkAddress', function(done) {
    co(function* () {
      try {
        const result = yield bumo.account.checkAddress('buQXz2qbTb3yx2cRyCz92EnaUKHrwZognnDw');
        result.data.should.equal(true);
				done();
      } catch (err) {
				done(err);
      }
    }).catch(err => {
      done(err);
    });

  });

  it('test: sendBu', function(done) {
    co(function* () {
      try {
        const info = yield bumo.account.getInfo('buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1');
        // console.log(info);
        const nonce = info.data.nonce;

        const options = {
          senderPrivateKey: 'privbwAAXFXsf4z7VtzPtWFmfDM8dEGZ97fsskUaJYeoduCCMxxv8jnH',
          receiverAddress: 'buQtGi7QmaiaMDygKxMAsKPyLicYjPV2xKVq',
          amount: '3000000',
          // amount: '99999999989748006',
          // amount: `18446744073709552000`,
          nonce: nonce + '',
          // gasPrice: '-1',
          // feeLimit: '10',
        };

        const data = yield bumo.sendBu(options);
        // console.log(data);
        data.error_code.should.equal(0);
				done();
      } catch (err) {
				done(err);
      }
    }).catch(err => {
      done(err);
    });
  });
});
