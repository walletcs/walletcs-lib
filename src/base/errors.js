const PARSING_ERROR = 'Error parser file. Check format file.';
const TX_FORMAT = 'Invalid unsigned transaction format.';
const MNEMONIC = 'Invalid mnemonic.';
const XPRIV = 'Invalid xPriv.';
const XPUB = 'Invalid xPub.';
const PRIVATE_KEY = 'Invalid private key.';
const INTERFACE_ERROR = 'This method must be implement.';
const BUILD_TX_ERROR = 'Transaction was not built.';

function errorNotImplementedInterface() {
  throw Error(INTERFACE_ERROR);
}

module.exports = {
  errorNotImplementedInterface,
  PARSING_ERROR,
  TX_FORMAT,
  MNEMONIC,
  XPRIV,
  XPUB,
  PRIVATE_KEY,
  BUILD_TX_ERROR
};