const classes = require('extends-classes');
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

  searchAddressInParent(xprv, address, deep) {
    errors.errorNotImplementedInterface();
  }
}

class BIP39Interface {
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

class WalletHDInterface extends classes(BIP32Interface, BIP39Interface) {
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