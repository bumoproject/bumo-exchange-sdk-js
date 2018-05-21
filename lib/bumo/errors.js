'use strict';

const errorDesc = require('./errorDesc');

module.exports = {
  getDesc(code) {
    const desc = `${errorDesc[code]}, error code: ${code}` || `Unknown error, error code: ${code}.`;
    return new Error(desc);
  },
  IncompleteParameters() {
    return new Error('Incomplete parameters to the function.');
  },
  InvalidNumberOfArgs() {
    return new Error('Invalid number of arguments to the function.');
  },
  InvalidConnection(host) {
    return new Error(`CONNECTION ERROR: Couldn\'t connect to node ${host}.`);
  },
  InvalidResponse(result) {
    const message = !!result && !!result.error && !!result.error.message ? result.error.message : 'Invalid JSON RPC response: ' + JSON.stringify(result);
    return new Error(message);
  },
  ConnectionTimeout(ms) {
    return new Error(`CONNECTION TIMEOUT: timeout of ${ms} ms achived.`);
  },
};
