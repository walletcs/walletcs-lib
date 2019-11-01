"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var errors = require('./errors');
/* Transaction Builders */


var TxBuilderInterface =
/*#__PURE__*/
function () {
  function TxBuilderInterface() {
    (0, _classCallCheck2["default"])(this, TxBuilderInterface);
    this.transaction = null;
  }

  (0, _createClass2["default"])(TxBuilderInterface, [{
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
  (0, _inherits2["default"])(EtherTxBuilderInterface, _TxBuilderInterface);

  function EtherTxBuilderInterface() {
    (0, _classCallCheck2["default"])(this, EtherTxBuilderInterface);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EtherTxBuilderInterface).apply(this, arguments));
  }

  (0, _createClass2["default"])(EtherTxBuilderInterface, [{
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
  (0, _inherits2["default"])(EtherContractTxBuilderInterface, _EtherTxBuilderInterf);

  function EtherContractTxBuilderInterface() {
    (0, _classCallCheck2["default"])(this, EtherContractTxBuilderInterface);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EtherContractTxBuilderInterface).apply(this, arguments));
  }

  (0, _createClass2["default"])(EtherContractTxBuilderInterface, [{
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
  (0, _inherits2["default"])(BitcoinTxBuilderInterfce, _TxBuilderInterface2);

  function BitcoinTxBuilderInterfce() {
    (0, _classCallCheck2["default"])(this, BitcoinTxBuilderInterfce);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BitcoinTxBuilderInterfce).apply(this, arguments));
  }

  (0, _createClass2["default"])(BitcoinTxBuilderInterfce, [{
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
    (0, _classCallCheck2["default"])(this, UnsignedTxInterface);
    this.to = null;
    this.from = null;
  }

  (0, _createClass2["default"])(UnsignedTxInterface, [{
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
  (0, _inherits2["default"])(EtherUnsignedTxInterface, _UnsignedTxInterface);

  function EtherUnsignedTxInterface() {
    var _this;

    (0, _classCallCheck2["default"])(this, EtherUnsignedTxInterface);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EtherUnsignedTxInterface).call(this));
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
  (0, _inherits2["default"])(EtherContractUnsignedTxInterface, _EtherUnsignedTxInter);

  function EtherContractUnsignedTxInterface() {
    var _this2;

    (0, _classCallCheck2["default"])(this, EtherContractUnsignedTxInterface);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EtherContractUnsignedTxInterface).call(this));
    _this2.methodName = null;
    _this2.mthodParams = null;
    return _this2;
  }

  return EtherContractUnsignedTxInterface;
}(EtherUnsignedTxInterface);

var BitcoinUnsignedTxInterface =
/*#__PURE__*/
function (_UnsignedTxInterface2) {
  (0, _inherits2["default"])(BitcoinUnsignedTxInterface, _UnsignedTxInterface2);

  function BitcoinUnsignedTxInterface() {
    var _this3;

    (0, _classCallCheck2["default"])(this, BitcoinUnsignedTxInterface);
    _this3 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BitcoinUnsignedTxInterface).call(this));
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