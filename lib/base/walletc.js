"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var errors = require('./errors');

var BIP32Interface =
/*#__PURE__*/
function () {
  function BIP32Interface() {
    (0, _classCallCheck2["default"])(this, BIP32Interface);
  }

  (0, _createClass2["default"])(BIP32Interface, [{
    key: "getXpubFromXpriv",
    value: function getXpubFromXpriv(xprv) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "getAddressFromXpub",
    value: function getAddressFromXpub(xpub) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "getAddressWithPrivateFromXprv",
    value: function getAddressWithPrivateFromXprv(xprv) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "searchAddressInParent",
    value: function searchAddressInParent(xprv, address, depth) {
      errors.errorNotImplementedInterface();
    }
  }]);
  return BIP32Interface;
}();

var BIP39Interface =
/*#__PURE__*/
function (_BIP32Interface) {
  (0, _inherits2["default"])(BIP39Interface, _BIP32Interface);

  function BIP39Interface() {
    (0, _classCallCheck2["default"])(this, BIP39Interface);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BIP39Interface).apply(this, arguments));
  }

  (0, _createClass2["default"])(BIP39Interface, [{
    key: "getFromMnemonic",
    value: function getFromMnemonic(mnemonic) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "validateMnemonic",
    value: function validateMnemonic(mnemonic) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "generateMnemonic",
    value: function generateMnemonic() {
      errors.errorNotImplementedInterface();
    }
  }]);
  return BIP39Interface;
}(BIP32Interface);

var WalletHDInterface =
/*#__PURE__*/
function (_BIP39Interface) {
  (0, _inherits2["default"])(WalletHDInterface, _BIP39Interface);

  function WalletHDInterface() {
    (0, _classCallCheck2["default"])(this, WalletHDInterface);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(WalletHDInterface).apply(this, arguments));
  }

  (0, _createClass2["default"])(WalletHDInterface, [{
    key: "signTransactionByPrivateKey",
    value: function signTransactionByPrivateKey(prvKey, unsignedTx) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "signTransactionByxPriv",
    value: function signTransactionByxPriv(txs, xprv) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "decodeSignedTransaction",
    value: function decodeSignedTransaction(tx) {
      errors.errorNotImplementedInterface();
    }
  }]);
  return WalletHDInterface;
}(BIP39Interface);

module.exports = {
  WalletHDInterface: WalletHDInterface
};