require('babel-polyfill');
require("@babel/register");

const errors = require('./errors');

class BIP32Interface {
  getXpubFromXpriv(xprv) {
    errors.errorNotImplementedInterface();
  }

  getAddressFromXpub(xpub) {
    errors.errorNotImplementedInterface();
  }

  getAddressWithPrivateFromXprv(xprv) {
    errors.errorNotImplementedInterface();
  }

  searchAddressInParent(xprv, address, depth) {
    errors.errorNotImplementedInterface();
  }
}

class BIP39Interface extends BIP32Interface{
  getFromMnemonic(mnemonic) {
    errors.errorNotImplementedInterface();
  }

  validateMnemonic(mnemonic) {
    errors.errorNotImplementedInterface();
  }

  generateMnemonic(){
    errors.errorNotImplementedInterface();
  }
}

class WalletHDInterface extends BIP39Interface {
  signTransactionByPrivateKey(prvKey, unsignedTx) {
    errors.errorNotImplementedInterface();
  }

  signTransactionByxPriv(txs, xprv) {
    errors.errorNotImplementedInterface();
  }

  decodeSignedTransaction(tx) {
    errors.errorNotImplementedInterface();
  }
}

module.exports = {
  WalletHDInterface
};