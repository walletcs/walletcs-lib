"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _ = require('lodash');

var ethers = require('ethers');

var bitcore = require('bitcore-lib');

var abidecoder = require('abi-decoder');

var cloneDeep = require('clone-deep');

var transactions = require('./base/transactions');

var structures = require('./base/structures');

var errors = require('./base/errors');

function convetOutxToInput(outx) {
  var input = cloneDeep(structures.BitcoinInput);
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
  (0, _inherits2["default"])(EtherTx, _transactions$EtherUn);

  function EtherTx() {
    var _this;

    (0, _classCallCheck2["default"])(this, EtherTx);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EtherTx).call(this));
    _this.to = '';
    _this.from = '';
    _this.value = 0;
    _this.gasPrice = ethers.utils.bigNumberify(0);
    _this.gasLimit = ethers.utils.bigNumberify(0);
    _this.data = '0x';
    _this.nonce = 0;
    return _this;
  }

  (0, _createClass2["default"])(EtherTx, [{
    key: "isCompleted",
    value: function isCompleted() {
      return this.to && this.value !== undefined && this.nonce !== undefined && ethers.utils.bigNumberify(this.gasLimit) && ethers.utils.bigNumberify(this.gasPrice);
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
  (0, _inherits2["default"])(EtherContractTx, _EtherTx);

  function EtherContractTx() {
    var _this2;

    (0, _classCallCheck2["default"])(this, EtherContractTx);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EtherContractTx).call(this));
    _this2.methodName = null;
    _this2.methodParams = [];
    return _this2;
  }

  (0, _createClass2["default"])(EtherContractTx, [{
    key: "isCompleted",
    value: function isCompleted() {
      return this.to && this.value !== undefined && this.nonce !== undefined && ethers.utils.bigNumberify(this.gasLimit) && ethers.utils.bigNumberify(this.gasPrice) && this.data !== '0x';
    }
  }, {
    key: "__getTX",
    value: function __getTX() {
      if (!this.isCompleted()) {
        return null;
      }

      var to = Array.isArray(this.to) && !!this.to.length ? this.to[0].address : this.to;
      return {
        to: to,
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
  (0, _inherits2["default"])(BitcoinTx, _transactions$Bitcoin);

  function BitcoinTx() {
    var _this3;

    (0, _classCallCheck2["default"])(this, BitcoinTx);
    _this3 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BitcoinTx).call(this));
    _this3.to = [];
    _this3.from = [];
    _this3.inputs = [];
    _this3.change = 0;
    _this3.fee = 0;
    _this3.changeAddress = '';
    _this3.threshold = 0;
    return _this3;
  }

  (0, _createClass2["default"])(BitcoinTx, [{
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
  (0, _inherits2["default"])(EtherTxBuilder, _transactions$EtherTx);

  function EtherTxBuilder() {
    var _this4;

    (0, _classCallCheck2["default"])(this, EtherTxBuilder);
    _this4 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EtherTxBuilder).call(this));
    _this4.transaction = new EtherTx();
    return _this4;
  }

  (0, _createClass2["default"])(EtherTxBuilder, [{
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
  (0, _inherits2["default"])(BitcoinTxBuilder, _transactions$Bitcoin2);

  function BitcoinTxBuilder() {
    var _this5;

    (0, _classCallCheck2["default"])(this, BitcoinTxBuilder);
    _this5 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BitcoinTxBuilder).call(this));
    _this5.transaction = new BitcoinTx();
    return _this5;
  }

  (0, _createClass2["default"])(BitcoinTxBuilder, [{
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
  (0, _inherits2["default"])(EtherContractTxBuilder, _transactions$EtherCo);

  function EtherContractTxBuilder() {
    var _this7;

    (0, _classCallCheck2["default"])(this, EtherContractTxBuilder);
    _this7 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EtherContractTxBuilder).call(this));
    _this7.transaction = new EtherContractTx();
    return (0, _possibleConstructorReturn2["default"])(_this7, (0, _assertThisInitialized2["default"])(_this7));
  }

  (0, _createClass2["default"])(EtherContractTxBuilder, [{
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
      if (_.isArray(from) && from.length) {
        this.transaction.from = [{
          address: from[0].address
        }];
      }

      return this;
    }
  }, {
    key: "setToAddress",
    value: function setToAddress(to) {
      if (_.isArray(to) && to.length) {
        this.transaction.to = [{
          address: to[0].address
        }];
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
    (0, _classCallCheck2["default"])(this, TransactionConstructor);
    this.builder = builder;
  }

  (0, _createClass2["default"])(TransactionConstructor, [{
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