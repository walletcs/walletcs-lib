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

require('babel-polyfill');

require("@babel/register");

var _ = require('lodash');

var parsers = require('./base/paresers');

var errors = require('./base/errors');

var structures = require('./base/structures');

var transactions = require('./transactions');

var FILES_TYPES = {
  ether: 'ETHFileTx',
  bitcoin: 'BTCFileTx',
  unknown: 'unknown'
};

var JSONParser =
/*#__PURE__*/
function (_parsers$FileParserIn) {
  _inherits(JSONParser, _parsers$FileParserIn);

  function JSONParser() {
    _classCallCheck(this, JSONParser);

    return _possibleConstructorReturn(this, _getPrototypeOf(JSONParser).apply(this, arguments));
  }

  _createClass(JSONParser, null, [{
    key: "parseFile",
    value: function parseFile(file) {
      try {
        var data = JSON.parse(file);
        var typeFile = JSONParser.getType(file);
        if (typeFile === FILES_TYPES.unknown) throw Error(errors.PARSING_ERROR);
        var result = [];

        if (typeFile === FILES_TYPES.ether) {
          _.each(data.transactions, function (tx) {
            var builder = null;
            var director = null;
            var createdTx = null;
            console.log(typeFile);
            console.log(tx);

            if (JSONParser.__isEtherStructure(tx)) {
              builder = new transactions.EtherTxBuilder();
              director = new transactions.TransactionConstructor(builder);
              createdTx = director.buildEtherTx(tx);
            } else if (JSONParser.__isContractStructure(tx)) {
              builder = new transactions.EtherContractTxBuilder();
              director = new transactions.TransactionConstructor(builder);

              var contract = _.filter(data.contracts, function (contract) {
                return contract.address === tx.to;
              });

              createdTx = director.buildEtherContractTx(tx, contract[0].abi);
            } else {
              throw Error(errors.PARSING_ERROR);
            }

            result.push(createdTx);
          });
        }

        if (typeFile === FILES_TYPES.bitcoin) {
          JSONParser.__checkListStructure(data.outx, structures.Outx);

          var builder = new transactions.BitcoinTxBuilder();
          var director = new transactions.TransactionConstructor(builder);
          var tx = director.buildBitcoinTx(data.outx, data.from, data.to, data.amount, data.changeAddress);
          if (tx) result.push(tx);
        }

        return result;
      } catch (e) {
        throw Error(errors.PARSING_ERROR);
      }
    }
  }, {
    key: "getType",
    value: function getType(file) {
      try {
        var data = JSON.parse(file);
        var sortedKeys = Object.keys(data).sort();

        if (_.isEqual(sortedKeys, Object.keys(structures.BitcoinFileTransaction).sort())) {
          return FILES_TYPES.bitcoin;
        }

        if (_.isEqual(sortedKeys, Object.keys(structures.EtherFileTransaction).sort())) {
          return FILES_TYPES.ether;
        }

        return FILES_TYPES.unknown;
      } catch (e) {
        return FILES_TYPES.unknown;
      }
    }
  }, {
    key: "__isContractStructure",
    value: function __isContractStructure(data) {
      return this.__checkStructure(data, structures.EtherContractTransaction);
    }
  }, {
    key: "__isEtherStructure",
    value: function __isEtherStructure(data) {
      return this.__checkStructure(data, structures.EtherTransaction);
    }
  }, {
    key: "__checkStructure",
    value: function __checkStructure(inputStructure, exampleStructure) {
      return _.isEqual(Object.keys(inputStructure).sort(), Object.keys(exampleStructure).sort());
    }
  }, {
    key: "__checkListStructure",
    value: function __checkListStructure(data, structure) {
      var sortedKeys = Object.keys(structure).sort();

      _.each(data, function (item) {
        if (!_.isEqual(Object.keys(item).sort(), sortedKeys)) {
          throw Error(errors.PARSING_ERROR);
        }
      });
    }
  }]);

  return JSONParser;
}(parsers.FileParserInterface);

module.exports = {
  JSONParser: JSONParser
};