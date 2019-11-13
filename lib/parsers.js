"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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
  (0, _inherits2["default"])(JSONParser, _parsers$FileParserIn);

  function JSONParser() {
    (0, _classCallCheck2["default"])(this, JSONParser);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(JSONParser).apply(this, arguments));
  }

  (0, _createClass2["default"])(JSONParser, null, [{
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

            if (JSONParser.__isEtherTx(tx)) {
              builder = new transactions.EtherTxBuilder();
              director = new transactions.TransactionConstructor(builder);
              createdTx = director.buildEtherTx(tx);
            } else if (JSONParser.__isContractTx(tx)) {
              builder = new transactions.EtherContractTxBuilder();
              director = new transactions.TransactionConstructor(builder);
              var address = tx.to[0] ? tx.to[0].address : tx.to.address;

              var contract = _.filter(data.contracts, function (contract) {
                return contract.address === address;
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
          var tx = director.buildBitcoinTx(data.outx, data.from, data.to, data.fee);
          if (tx) result.push(tx);
        }

        return result;
      } catch (e) {
        console.log('ERROR INFO:', e);
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
    key: "__isContractTx",
    value: function __isContractTx(data) {
      return !!data.data && data.data !== '0x';
    }
  }, {
    key: "__isEtherTx",
    value: function __isEtherTx(data) {
      return !JSONParser.__isContractTx(data);
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