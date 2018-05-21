'use strict';

const BUMOSDK = require('./lib/bumo');

if (typeof window !== 'undefined' && typeof window.BUMOSDK === 'undefined') {
  window.BUMOSDK = BUMOSDK;
}

module.exports = BUMOSDK;
