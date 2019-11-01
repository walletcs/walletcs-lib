"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var errors = require('./errors');

var BIP32Interface =
/*#__PURE__*/
function () {
  function BIP32Interface() {
    _classCallCheck(this, BIP32Interface);
  }

  _createClass(BIP32Interface, [{
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
  _inherits(BIP39Interface, _BIP32Interface);

  function BIP39Interface() {
    _classCallCheck(this, BIP39Interface);

    return _possibleConstructorReturn(this, _getPrototypeOf(BIP39Interface).apply(this, arguments));
  }

  _createClass(BIP39Interface, [{
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
  _inherits(WalletHDInterface, _BIP39Interface);

  function WalletHDInterface() {
    _classCallCheck(this, WalletHDInterface);

    return _possibleConstructorReturn(this, _getPrototypeOf(WalletHDInterface).apply(this, arguments));
  }

  _createClass(WalletHDInterface, [{
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