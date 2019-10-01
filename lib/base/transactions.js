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

require('babel-polyfill');

require("@babel/register");

var errors = require('./errors');
/* Transaction Builders */


var TxBuilderInterface =
/*#__PURE__*/
function () {
  function TxBuilderInterface() {
    _classCallCheck(this, TxBuilderInterface);

    this.transaction = null;
  }

  _createClass(TxBuilderInterface, [{
    key: "setToAddress",
    value: function setToAddress(address) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "setAmount",
    value: function setAmount(amount) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "getResult",
    value: function getResult() {
      errors.errorNotImplementedInterface();
    }
  }]);

  return TxBuilderInterface;
}();

var EtherTxBuilderInterface =
/*#__PURE__*/
function (_TxBuilderInterface) {
  _inherits(EtherTxBuilderInterface, _TxBuilderInterface);

  function EtherTxBuilderInterface() {
    _classCallCheck(this, EtherTxBuilderInterface);

    return _possibleConstructorReturn(this, _getPrototypeOf(EtherTxBuilderInterface).apply(this, arguments));
  }

  _createClass(EtherTxBuilderInterface, [{
    key: "setNonce",
    value: function setNonce(nonce) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "setGasPrice",
    value: function setGasPrice() {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "setGasLimit",
    value: function setGasLimit() {
      errors.errorNotImplementedInterface();
    }
  }]);

  return EtherTxBuilderInterface;
}(TxBuilderInterface);

var EtherContractTxBuilderInterface =
/*#__PURE__*/
function (_EtherTxBuilderInterf) {
  _inherits(EtherContractTxBuilderInterface, _EtherTxBuilderInterf);

  function EtherContractTxBuilderInterface() {
    _classCallCheck(this, EtherContractTxBuilderInterface);

    return _possibleConstructorReturn(this, _getPrototypeOf(EtherContractTxBuilderInterface).apply(this, arguments));
  }

  _createClass(EtherContractTxBuilderInterface, [{
    key: "setMethodName",
    value: function setMethodName(name) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "setParameters",
    value: function setParameters(params) {
      errors.errorNotImplementedInterface();
    }
  }]);

  return EtherContractTxBuilderInterface;
}(EtherTxBuilderInterface);

var BitcoinTxBuilderInterfce =
/*#__PURE__*/
function (_TxBuilderInterface2) {
  _inherits(BitcoinTxBuilderInterfce, _TxBuilderInterface2);

  function BitcoinTxBuilderInterfce() {
    _classCallCheck(this, BitcoinTxBuilderInterfce);

    return _possibleConstructorReturn(this, _getPrototypeOf(BitcoinTxBuilderInterfce).apply(this, arguments));
  }

  _createClass(BitcoinTxBuilderInterfce, [{
    key: "setFromAddress",
    value: function setFromAddress(address) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "addOutx",
    value: function addOutx(input) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "setChangeAddress",
    value: function setChangeAddress(address) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "calculateFee",
    value: function calculateFee(fee) {
      errors.errorNotImplementedInterface();
    }
  }]);

  return BitcoinTxBuilderInterfce;
}(TxBuilderInterface);
/* Unsigned Transactions */


var UnsignedTxInterface =
/*#__PURE__*/
function () {
  function UnsignedTxInterface() {
    _classCallCheck(this, UnsignedTxInterface);

    this.to = null;
    this.from = null;
  }

  _createClass(UnsignedTxInterface, [{
    key: "toJSON",
    value: function toJSON() {
      errors.errorNotImplementedInterface();
    }
  }]);

  return UnsignedTxInterface;
}();

var EtherUnsignedTxInterface =
/*#__PURE__*/
function (_UnsignedTxInterface) {
  _inherits(EtherUnsignedTxInterface, _UnsignedTxInterface);

  function EtherUnsignedTxInterface() {
    var _this;

    _classCallCheck(this, EtherUnsignedTxInterface);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EtherUnsignedTxInterface).call(this));
    _this.value = null;
    _this.gasLimit = null;
    _this.gasPrice = null;
    _this.nonce = null;
    return _this;
  }

  return EtherUnsignedTxInterface;
}(UnsignedTxInterface);

var EtherContractUnsignedTxInterface =
/*#__PURE__*/
function (_EtherUnsignedTxInter) {
  _inherits(EtherContractUnsignedTxInterface, _EtherUnsignedTxInter);

  function EtherContractUnsignedTxInterface() {
    var _this2;

    _classCallCheck(this, EtherContractUnsignedTxInterface);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(EtherContractUnsignedTxInterface).call(this));
    _this2.methodName = null;
    _this2.mthodParams = null;
    return _this2;
  }

  return EtherContractUnsignedTxInterface;
}(EtherUnsignedTxInterface);

var BitcoinUnsignedTxInterface =
/*#__PURE__*/
function (_UnsignedTxInterface2) {
  _inherits(BitcoinUnsignedTxInterface, _UnsignedTxInterface2);

  function BitcoinUnsignedTxInterface() {
    var _this3;

    _classCallCheck(this, BitcoinUnsignedTxInterface);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(BitcoinUnsignedTxInterface).call(this));
    _this3.inputs = null;
    _this3.changeAddress = null;
    _this3.fee = null;
    return _this3;
  }

  return BitcoinUnsignedTxInterface;
}(UnsignedTxInterface);

module.exports = {
  BitcoinTxBuilderInterfce: BitcoinTxBuilderInterfce,
  EtherTxBuilderInterface: EtherTxBuilderInterface,
  EtherContractTxBuilderInterface: EtherContractTxBuilderInterface,
  BitcoinUnsignedTxInterface: BitcoinUnsignedTxInterface,
  EtherUnsignedTxInterface: EtherUnsignedTxInterface,
  EtherContractUnsignedTxInterface: EtherContractUnsignedTxInterface
};