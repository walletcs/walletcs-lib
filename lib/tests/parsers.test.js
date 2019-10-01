"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var parsers = require('../parsers');

var structures = require('../base/structures');

var errors = require('../base/errors');

var ethers = require('ethers');

var _ = require('lodash');

var bitcoinFileTx = {
  "outx": [{
    "txId": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
    "outputIndex": 2,
    "address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X",
    "satoshis": 8847983
  }, {
    "txId": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
    "outputIndex": 1,
    "address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X",
    "satoshis": 20000
  }, {
    "txId": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
    "outputIndex": 0,
    "address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X",
    "satoshis": 10000
  }],
  "from": [{
    "address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X",
    "change": false
  }],
  "to": [{
    "address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X",
    "amount": 0.0001
  }, {
    "address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X",
    "amount": 0.00011
  }],
  "fee": 0
};
var etherFileTx = {
  "transactions": [{
    "gasLimit": 21000,
    "gasPrice": {
      "_hex": "0x3b9aca00"
    },
    "nonce": 32,
    "to": {
      "address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3",
      "amount": 1
    },
    "from": {
      "address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3",
      "change": true
    },
    "data": "0x"
  }],
  "contracts": []
};
var etherContractFileTx = {
  "transactions": [{
    "gasLimit": 21000,
    "gasPrice": {
      "_hex": "0x3b9aca00"
    },
    "nonce": 32,
    "to": {
      "address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3"
    },
    "from": {
      "address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3"
    },
    "data": "0x1"
  }],
  "contracts": [{
    'address': '0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3',
    'abi': []
  }]
};
var mixedEtherFileTx = {
  "transactions": [{
    "gasLimit": 21000,
    "gasPrice": {
      "_hex": "0x3b9aca00"
    },
    "nonce": 32,
    "to": [{
      "address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3",
      "amount": 10000
    }],
    "from": [{
      "address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3"
    }],
    "data": "0x"
  }, {
    "gasLimit": 21000,
    "gasPrice": {
      "_hex": "0x3b9aca00"
    },
    "nonce": 32,
    "to": [{
      "address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3"
    }],
    "from": [{
      "address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3"
    }],
    "data": "0x1"
  }],
  "contracts": [{
    'address': '0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3',
    'abi': []
  }]
};
test('Test parser bitcoin file tx',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var result;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          result = parsers.JSONParser.parseFile(JSON.stringify(bitcoinFileTx));
          expect(result[0].to).toEqual([{
            "address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X",
            "satoshis": 10000
          }, {
            "address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X",
            "satoshis": 11000
          }]);
          expect(result[0].from).toEqual(['mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X']);
          expect(Object.keys(result[0].inputs[0]).sort()).toEqual(Object.keys(structures.BitcoinInput).sort());
          expect(result[0].changeAddress).toEqual('');
          expect(result[0].fee).not.toEqual(0);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
})));
test('Test parser ether file tx',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee2() {
  var result;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          result = parsers.JSONParser.parseFile(JSON.stringify(etherFileTx));
          expect(result[0].to).toEqual('0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3');
          expect(result[0].value).toEqual(ethers.utils.parseEther('1'));
          expect(result[0].gasLimit).toEqual(ethers.utils.bigNumberify(21000));
          expect(result[0].gasPrice).toEqual(ethers.utils.bigNumberify({
            "_hex": "0x3b9aca00"
          }));
          expect(result[0].nonce).toEqual(32);
          expect(result[0].data).toEqual('0x');

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, this);
})));
test('Test parser ether contract file tx',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee3() {
  var result;
  return regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          result = parsers.JSONParser.parseFile(JSON.stringify(etherContractFileTx));
          expect(result[0].to).toEqual('0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3');
          expect(result[0].gasLimit).toEqual(ethers.utils.bigNumberify(21000));
          expect(result[0].gasPrice).toEqual(ethers.utils.bigNumberify({
            "_hex": "0x3b9aca00"
          }));
          expect(result[0].nonce).toEqual(32);
          expect(result[0].data).toEqual('0x1');

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3, this);
})));
test('Test parser ether mixed file',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee4() {
  var result;
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          result = parsers.JSONParser.parseFile(JSON.stringify(mixedEtherFileTx));
          expect(result[1].to).toEqual('0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3');
          expect(result[1].gasLimit).toEqual(ethers.utils.bigNumberify(21000));
          expect(result[1].gasPrice).toEqual(ethers.utils.bigNumberify({
            "_hex": "0x3b9aca00"
          }));
          expect(result[1].nonce).toEqual(32);
          expect(result[1].data).toEqual('0x1');
          expect(result[0].to).toEqual('0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3');
          expect(result[0].value).toEqual(ethers.utils.parseEther('10000'));
          expect(result[0].gasLimit).toEqual(ethers.utils.bigNumberify(21000));
          expect(result[0].gasPrice).toEqual(ethers.utils.bigNumberify({
            "_hex": "0x3b9aca00"
          }));
          expect(result[0].nonce).toEqual(32);
          expect(result[0].data).toEqual('0x');

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee4, this);
})));
test('Test for empty file',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee5() {
  return regeneratorRuntime.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          expect(function () {
            parsers.JSONParser.parseFile('');
          }).toThrowError(errors.PARSING_ERROR);
          expect(parsers.JSONParser.getType('')).toEqual('unknown');

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  }, _callee5, this);
})));
test('Test parsing not filled ether file out ',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee6() {
  var emptyEtherFile, result, typeFile;
  return regeneratorRuntime.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          emptyEtherFile = {
            "transactions": [],
            "contracts": []
          };
          result = parsers.JSONParser.parseFile(JSON.stringify(emptyEtherFile));
          typeFile = parsers.JSONParser.getType(JSON.stringify(emptyEtherFile));
          expect(_.isArray(result)).toBeTruthy();
          expect(result.length).toEqual(0);
          expect(typeFile).toEqual('ETHFileTx');

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  }, _callee6, this);
})));
test('Test parsing not filled bitcoin file out',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee7() {
  var emptyBitcoinFileTx, result, typeFile;
  return regeneratorRuntime.wrap(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          emptyBitcoinFileTx = {
            "outx": [],
            "from": [],
            "to": [],
            "fee": null
          };
          result = parsers.JSONParser.parseFile(JSON.stringify(emptyBitcoinFileTx));
          typeFile = parsers.JSONParser.getType(JSON.stringify(emptyBitcoinFileTx));
          expect(_.isArray(result)).toBeTruthy();
          expect(result.length).toEqual(0);
          expect(typeFile).toEqual('BTCFileTx');

        case 6:
        case "end":
          return _context7.stop();
      }
    }
  }, _callee7, this);
})));