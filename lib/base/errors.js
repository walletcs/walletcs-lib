"use strict";

var PARSING_ERROR = 'Error parser file. Check format file.';
var TX_FORMAT = 'Invalid unsigned transaction format.';
var MNEMONIC = 'Invalid mnemonic.';
var XPRIV = 'Invalid xPriv.';
var XPUB = 'Invalid xPub.';
var PRIVATE_KEY = 'Invalid private key.';
var INTERFACE_ERROR = 'This method must be implement.';
var BUILD_TX_ERROR = 'Transaction was not built.';

function errorNotImplementedInterface() {
  throw Error(INTERFACE_ERROR);
}

module.exports = {
  errorNotImplementedInterface: errorNotImplementedInterface,
  PARSING_ERROR: PARSING_ERROR,
  TX_FORMAT: TX_FORMAT,
  MNEMONIC: MNEMONIC,
  XPRIV: XPRIV,
  XPUB: XPUB,
  PRIVATE_KEY: PRIVATE_KEY,
  BUILD_TX_ERROR: BUILD_TX_ERROR
};