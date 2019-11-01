"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var transactions = require('./base/transactions');

var structures = require('./base/structures');

var errors = require('./base/errors');

var _ = require('lodash');

var ethers = require('ethers');

var bitcore = require('bitcore-lib');

var abidecoder = require('abi-decoder');

function convetOutxToInput(outx) {
  var input = JSON.parse(JSON.stringify(structures.BitcoinInput));
  input.address = outx.address;
  input.txId = outx.txId;
  input.satoshis = outx.satoshis;
  input.outputIndex = outx.outputIndex;
  input.script = new bitcore.Script(bitcore.Address(outx.address)).toHex();
  return input;
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

function convertToSatoshi(val) {
  if (isFloat(val)) {
    return parseInt(parseFloat(val) * Math.pow(10, 8));
  }

  return val;
}

var EtherTx =
/*#__PURE__*/
function (_transactions$EtherUn) {
  _inherits(EtherTx, _transactions$EtherUn);

  function EtherTx() {
    var _this;

    _classCallCheck(this, EtherTx);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EtherTx).call(this));
    _this.to = '';
    _this.from = '';
    _this.value = 0;
    _this.gasPrice = ethers.utils.bigNumberify(0);
    _this.gasLimit = ethers.utils.bigNumberify(0);
    _this.data = '0x';
    _this.nonce = 0;
    return _this;
  }

  _createClass(EtherTx, [{
    key: "isCompleted",
    value: function isCompleted() {
      return this.to && this.value && this.nonce !== undefined && ethers.utils.bigNumberify(this.gasLimit) && ethers.utils.bigNumberify(this.gasPrice);
    }
  }, {
    key: "__getTX",
    value: function __getTX() {
      if (!this.isCompleted()) return null;
      return {
        to: this.to,
        value: this.value,
        gasPrice: this.gasPrice.toNumber(),
        gasLimit: this.gasLimit.toNumber(),
        data: this.data,
        nonce: this.nonce
      };
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      if (!this.isCompleted()) throw Error(errors.BUILD_TX_ERROR);
      return JSON.stringify(this.__getTX());
    }
  }, {
    key: "getTx",
    value: function getTx() {
      return this.__getTX();
    }
  }]);

  return EtherTx;
}(transactions.EtherUnsignedTxInterface);

var EtherContractTx =
/*#__PURE__*/
function (_EtherTx) {
  _inherits(EtherContractTx, _EtherTx);

  function EtherContractTx() {
    var _this2;

    _classCallCheck(this, EtherContractTx);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(EtherContractTx).call(this));
    _this2.methodName = null;
    _this2.methodParams = [];
    return _this2;
  }

  _createClass(EtherContractTx, [{
    key: "isCompleted",
    value: function isCompleted() {
      return this.to && this.value && this.nonce !== undefined && ethers.utils.bigNumberify(this.gasLimit) && ethers.utils.bigNumberify(this.gasPrice) && this.data !== '0x';
    }
  }, {
    key: "__getTX",
    value: function __getTX() {
      if (!this.isCompleted()) return null;
      return {
        to: this.to,
        gasPrice: this.gasPrice.toNumber(),
        gasLimit: this.gasLimit.toNumber(),
        data: this.data,
        nonce: this.nonce
      };
    }
  }]);

  return EtherContractTx;
}(EtherTx);

var BitcoinTx =
/*#__PURE__*/
function (_transactions$Bitcoin) {
  _inherits(BitcoinTx, _transactions$Bitcoin);

  function BitcoinTx() {
    var _this3;

    _classCallCheck(this, BitcoinTx);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(BitcoinTx).call(this));
    _this3.to = [];
    _this3.from = [];
    _this3.inputs = [];
    _this3.change = 0;
    _this3.fee = 0;
    _this3.changeAddress = '';
    _this3.threshold = 0;
    return _this3;
  }

  _createClass(BitcoinTx, [{
    key: "isCompleted",
    value: function isCompleted() {
      return !!this.to.length && !!this.from.length && !!this.inputs.length && !!this.fee;
    }
  }, {
    key: "__getTX",
    value: function __getTX() {
      if (!this.isCompleted()) return null;
      return {
        to: this.to,
        from: this.from,
        inputs: this.inputs,
        change: this.change,
        fee: this.fee,
        changeAddress: this.changeAddress,
        threshold: this.threshold
      };
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      if (!this.isCompleted()) throw Error(errors.BUILD_TX_ERROR);
      return JSON.stringify(this.__getTX());
    }
  }, {
    key: "getTx",
    value: function getTx() {
      return this.__getTX();
    }
  }]);

  return BitcoinTx;
}(transactions.BitcoinUnsignedTxInterface);

var EtherTxBuilder =
/*#__PURE__*/
function (_transactions$EtherTx) {
  _inherits(EtherTxBuilder, _transactions$EtherTx);

  function EtherTxBuilder() {
    var _this4;

    _classCallCheck(this, EtherTxBuilder);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(EtherTxBuilder).call(this));
    _this4.transaction = new EtherTx();
    return _this4;
  }

  _createClass(EtherTxBuilder, [{
    key: "setFromAddress",
    value: function setFromAddress(from) {
      if (_.isArray(from)) {
        var item = from.pop();

        if (item) {
          this.transaction.from = item.address;
        }
      } else {
        this.transaction.from = from.address;
      }

      return this;
    }
  }, {
    key: "setToAddress",
    value: function setToAddress(to) {
      if (_.isArray(to)) {
        var item = to.pop();

        if (item) {
          this.transaction.to = item.address;
          this.setAmount(item.amount);
        }
      } else {
        this.transaction.to = to.address;
        this.setAmount(to.amount);
      }

      return this;
    }
  }, {
    key: "setFromAddress",
    value: function setFromAddress(address) {
      this.transaction.from = address;
    }
  }, {
    key: "setAmount",
    value: function setAmount(amount) {
      this.transaction.value = ethers.utils.parseEther(amount.toString() || '0');
      return this;
    }
  }, {
    key: "setNonce",
    value: function setNonce(nonce) {
      this.transaction.nonce = parseInt(nonce || 0);
      return this;
    }
  }, {
    key: "setGasPrice",
    value: function setGasPrice(gas) {
      this.transaction.gasPrice = ethers.utils.bigNumberify(gas || 1000000000);
      return this;
    }
  }, {
    key: "setGasLimit",
    value: function setGasLimit(gas) {
      this.transaction.gasLimit = ethers.utils.bigNumberify(gas || 21000);
      return this;
    }
  }, {
    key: "getResult",
    value: function getResult() {
      return this.transaction;
    }
  }]);

  return EtherTxBuilder;
}(transactions.EtherTxBuilderInterface);

var BitcoinTxBuilder =
/*#__PURE__*/
function (_transactions$Bitcoin2) {
  _inherits(BitcoinTxBuilder, _transactions$Bitcoin2);

  function BitcoinTxBuilder() {
    var _this5;

    _classCallCheck(this, BitcoinTxBuilder);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(BitcoinTxBuilder).call(this));
    _this5.transaction = new BitcoinTx();
    return _this5;
  }

  _createClass(BitcoinTxBuilder, [{
    key: "setFromAddress",
    value: function setFromAddress(from) {
      var _this6 = this;

      var self = this;

      if (_.isArray(from)) {
        var _from = _.map(from, function (item) {
          if (item.change) self.setChangeAddress(item.address);
          return item.address;
        });

        _.each(_from, function (value) {
          if (value) _this6.transaction.from.push(value);
        });
      } else {
        if (from.change) self.setChangeAddress(from.address);
        this.transaction.from.push(from.address);
      }

      this.transaction.from = _.uniq(this.transaction.from);
      return this;
    }
  }, {
    key: "setThreshold",
    value: function setThreshold(threshold) {
      this.transaction.threshold = threshold;
      return this;
    }
  }, {
    key: "setToAddress",
    value: function setToAddress(to) {
      if (_.isArray(to)) {
        this.transaction.to = _.concat(this.transaction.to, _.map(to, function (item) {
          return {
            address: item.address,
            satoshis: convertToSatoshi(item.amount)
          };
        }));
      } else {
        this.transaction.to.push({
          address: to.address,
          satoshis: convertToSatoshi(to.amount)
        });
      }

      return this;
    }
  }, {
    key: "addOutx",
    value: function addOutx(outx) {
      var input = convetOutxToInput(outx);
      this.transaction.inputs.push(input);
      return this;
    }
  }, {
    key: "setChangeAddress",
    value: function setChangeAddress(address) {
      this.transaction.changeAddress = address;
      return this;
    }
  }, {
    key: "calculateFee",
    value: function calculateFee(fee) {
      if (!fee && !!this.transaction.to.length) {
        try {
          var tx = new bitcore.Transaction();
          tx.to(this.transaction.to);
          tx.from(this.transaction.inputs);
          this.transaction.fee = tx.getFee();
        } catch (e) {
          console.log('Warning fee calculation: ', e);
        }
      }

      if (fee) {
        this.transaction.fee = convertToSatoshi(fee);
      }

      return this;
    }
  }, {
    key: "getResult",
    value: function getResult() {
      return this.transaction.__getTX();
    }
  }]);

  return BitcoinTxBuilder;
}(transactions.BitcoinTxBuilderInterfce);

var EtherContractTxBuilder =
/*#__PURE__*/
function (_transactions$EtherCo) {
  _inherits(EtherContractTxBuilder, _transactions$EtherCo);

  function EtherContractTxBuilder() {
    var _this7;

    _classCallCheck(this, EtherContractTxBuilder);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(EtherContractTxBuilder).call(this));
    _this7.transaction = new EtherContractTx();
    return _possibleConstructorReturn(_this7, _assertThisInitialized(_this7));
  }

  _createClass(EtherContractTxBuilder, [{
    key: "setFromAddress",
    value: function setFromAddress(address) {
      this.transaction.from = address;
    }
  }, {
    key: "setMethodName",
    value: function setMethodName(name) {
      this.transaction.nameMethod = name;
      return this;
    }
  }, {
    key: "setMethodParams",
    value: function setMethodParams(params) {
      this.transaction.methodParams = params;
      return this;
    }
  }, {
    key: "setFromAddress",
    value: function setFromAddress(from) {
      if (_.isArray(from)) {
        var item = from.pop();

        if (item) {
          this.transaction.from = from.address;
        }
      }

      return this;
    }
  }, {
    key: "setToAddress",
    value: function setToAddress(to) {
      if (_.isArray(to)) {
        var item = to.pop();

        if (item) {
          this.transaction.to = item.address;
        }
      } else {
        this.transaction.to = to.address;
      }

      return this;
    }
  }, {
    key: "setNonce",
    value: function setNonce(nonce) {
      this.transaction.nonce = parseInt(nonce || 0);
      return this;
    }
  }, {
    key: "setGasPrice",
    value: function setGasPrice(gas) {
      this.transaction.gasPrice = ethers.utils.bigNumberify(gas || 1000000000);
      return this;
    }
  }, {
    key: "setGasLimit",
    value: function setGasLimit(gas) {
      this.transaction.gasLimit = ethers.utils.bigNumberify(gas || 21000);
      return this;
    }
  }, {
    key: "setData",
    value: function setData(data) {
      this.transaction.data = data;
      return this;
    }
  }, {
    key: "getResult",
    value: function getResult() {
      return this.transaction;
    }
  }]);

  return EtherContractTxBuilder;
}(transactions.EtherContractTxBuilderInterface);

var TransactionConstructor =
/*#__PURE__*/
function () {
  function TransactionConstructor(builder) {
    _classCallCheck(this, TransactionConstructor);

    this.builder = builder;
  }

  _createClass(TransactionConstructor, [{
    key: "buildBitcoinTx",
    value: function buildBitcoinTx(outxs, from, to, fee) {
      this.builder.setFromAddress(from);
      this.builder.setToAddress(to);
      var self = this;

      if (_.isArray(outxs)) {
        _.each(outxs, function (outx) {
          self.builder.addOutx(outx);
        });
      } else {
        this.builder.addOutx(outxs);
      }

      this.builder.calculateFee(fee);
      return this.builder.getResult();
    }
  }, {
    key: "buildEtherTx",
    value: function buildEtherTx(transaction) {
      this.builder.setToAddress(transaction.to);
      this.builder.setFromAddress(transaction.from);
      this.builder.setNonce(transaction.nonce);
      this.builder.setGasPrice(transaction.gasPrice);
      this.builder.setGasLimit(transaction.gasLimit);
      return this.builder.getResult();
    }
  }, {
    key: "buildEtherContractTx",
    value: function buildEtherContractTx(transaction, abi) {
      abidecoder.addABI(abi);
      var methodData = abidecoder.decodeMethod(transaction.data);
      this.builder.setToAddress(transaction.to);
      this.builder.setFromAddress(transaction.from);
      this.builder.setNonce(transaction.nonce);
      this.builder.setGasPrice(transaction.gasPrice);
      this.builder.setGasLimit(transaction.gasLimit);
      this.builder.setData(transaction.data);
      this.builder.setMethodName(methodData ? methodData.name : null);
      this.builder.setMethodParams(methodData ? methodData.params : []);
      return this.builder.getResult();
    }
  }, {
    key: "buildBitcoinMultiSignTx",
    value: function buildBitcoinMultiSignTx(outxs, from, to, changeAddress, fee, threshold) {
      this.builder.setFromAddress(from);
      this.builder.setToAddress(to);
      this.builder.setThreshold(threshold);
      var self = this;

      if (_.isArray(outxs)) {
        _.each(outxs, function (outx) {
          self.builder.addOutx(outx);
        });
      } else {
        this.builder.addOutx(outxs);
      }

      this.builder.setChangeAddress(changeAddress);
      this.builder.calculateFee(fee);
      return this.builder.getResult();
    }
  }]);

  return TransactionConstructor;
}();

module.exports = {
  EtherTx: EtherTx,
  BitcoinTx: BitcoinTx,
  EtherContractTx: EtherContractTx,
  EtherTxBuilder: EtherTxBuilder,
  BitcoinTxBuilder: BitcoinTxBuilder,
  EtherContractTxBuilder: EtherContractTxBuilder,
  TransactionConstructor: TransactionConstructor
};