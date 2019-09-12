"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var transactions = require('../transactions');

var structures = require('../base/structures');

var errors = require('../base/errors');

var ethers = require('ethers');

var bitcore = require('bitcore-lib');

"use strict";

var ETHER_ADDRESS = '0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3';
var BITCOIN_ADDRESS = 'n3rkVDVgppH23BYNyWqULfih1nfesc2t3t';
test('Test create empty unspent EtherTx',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var etherTx;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          etherTx = new transactions.EtherTx();
          expect(etherTx.to).toEqual('');
          expect(etherTx.value).toEqual(0);
          expect(etherTx.gasPrice).toEqual(ethers.utils.bigNumberify(0));
          expect(etherTx.gasLimit).toEqual(ethers.utils.bigNumberify(0));
          expect(etherTx.nonce).toEqual(0);
          expect(etherTx.data).toEqual('0x');

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));
test('Test convert to JSON empty unspent EtherTx',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee2() {
  var etherTx;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          etherTx = new transactions.EtherTx();
          expect(etherTx.isCompleted()).not.toBeTruthy();

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
})));
test('Test convert to JSON empty unspent EtherContractTx',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee3() {
  var etherTx;
  return regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          etherTx = new transactions.EtherContractTx();
          expect(etherTx.isCompleted()).not.toBeTruthy();

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3);
})));
test('Test convert EtherTx to JSON',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee4() {
  var etherTx;
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          etherTx = new transactions.EtherTx();
          etherTx.to = '0x000000000000000000000000000000000';
          etherTx.gasPrice = ethers.utils.bigNumberify(1000000000);
          etherTx.gasLimit = ethers.utils.bigNumberify(21000);
          etherTx.value = ethers.utils.parseEther('0.001');
          etherTx.nonce = 1;
          expect(etherTx.toJSON()).toEqual(JSON.stringify(etherTx.__getTX()));

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee4);
})));
test('Test convert EtherContractTx to JSON',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee5() {
  var etherTx;
  return regeneratorRuntime.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          etherTx = new transactions.EtherContractTx();
          etherTx.to = '0x000000000000000000000000000000000';
          etherTx.data = '0x1111';
          etherTx.gasPrice = ethers.utils.bigNumberify(1000000000);
          etherTx.gasLimit = ethers.utils.bigNumberify(21000);
          etherTx.value = ethers.utils.parseEther('0.001');
          etherTx.nonce = 1;
          expect(etherTx.toJSON()).toEqual(JSON.stringify(etherTx.__getTX()));

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  }, _callee5);
})));
test('Test create unspent BitcoinTx',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee6() {
  var bitcoinTx;
  return regeneratorRuntime.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          bitcoinTx = new transactions.BitcoinTx();
          expect(bitcoinTx.to).toEqual([]);
          expect(bitcoinTx.from).toEqual([]);
          expect(bitcoinTx.amounts).toEqual([]);
          expect(bitcoinTx.changeAddress).toEqual('');
          expect(bitcoinTx.change).toEqual(0);
          expect(bitcoinTx.fee).toEqual(0);
          expect(bitcoinTx.inputs).toEqual([]);

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  }, _callee6);
})));
test('Test convert to JSON empty unspent BitcoinTx',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee7() {
  var bitcoinTx;
  return regeneratorRuntime.wrap(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          bitcoinTx = new transactions.BitcoinTx();
          expect(bitcoinTx.isCompleted()).not.toBeTruthy();

        case 2:
        case "end":
          return _context7.stop();
      }
    }
  }, _callee7);
})));
test('Test convert BitcoinTx to JSON',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee8() {
  var bitcoinTx;
  return regeneratorRuntime.wrap(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          bitcoinTx = new transactions.BitcoinTx();
          bitcoinTx.to = ['0x000000000000000000000000000000000'];
          bitcoinTx.from = ['0x000000000000000000000000000000000'];
          bitcoinTx.amounts = [1000, 10000];
          bitcoinTx.changeAddress = '0x000000000000000000000000000000000';
          bitcoinTx.change = 10000;
          bitcoinTx.fee = 100;
          bitcoinTx.inputs = [{
            'fake': 'input'
          }];
          expect(bitcoinTx.toJSON()).toEqual(JSON.stringify(bitcoinTx.__getTX()));

        case 9:
        case "end":
          return _context8.stop();
      }
    }
  }, _callee8);
})));
test('Test build ether transaction',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee9() {
  var builder, transaction;
  return regeneratorRuntime.wrap(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          builder = new transactions.EtherTxBuilder('rinkeby');
          builder.setToAddress(ETHER_ADDRESS);
          builder.setAmount(2);
          builder.setNonce(1);
          builder.setGasPrice(1000000000);
          builder.setGasLimit(21000);
          transaction = builder.getResult();
          expect(transaction.nonce).toEqual(1);
          expect(transaction.to).toEqual(ETHER_ADDRESS);
          expect(transaction.value).toEqual(ethers.utils.parseEther('2'));
          expect(transaction.gasLimit).toEqual(ethers.utils.bigNumberify(21000));
          expect(transaction.gasPrice).toEqual(ethers.utils.bigNumberify(1000000000));

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  }, _callee9);
})));
test('Test fail build ether transaction',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee10() {
  var builder;
  return regeneratorRuntime.wrap(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          builder = new transactions.EtherTxBuilder('rinkeby');
          builder.setToAddress(ETHER_ADDRESS);
          builder.setNonce(1);
          builder.setGasPrice(1000000000);
          builder.setGasLimit(21000);
          expect(builder.getResult().isCompleted()).not.toBeTruthy();

        case 6:
        case "end":
          return _context10.stop();
      }
    }
  }, _callee10);
})));
test('Test build bitcoin transaction',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee11() {
  var outx, builder, transaction;
  return regeneratorRuntime.wrap(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          outx = {
            txId: '557bf23415160ce932ea5215e238132bf1cc42c1a7f91846d335d0d1e33cd19f',
            address: BITCOIN_ADDRESS,
            satoshis: 2538851,
            outputIndex: 1
          };
          builder = new transactions.BitcoinTxBuilder();
          builder.setFromAddress(BITCOIN_ADDRESS);
          builder.setFromAddress(BITCOIN_ADDRESS);
          builder.setToAddress(BITCOIN_ADDRESS);
          builder.setToAddress(BITCOIN_ADDRESS);
          builder.setAmount(0.0001);
          builder.setAmount(0.0002);
          builder.setChangeAddress(BITCOIN_ADDRESS);
          builder.addOutx(outx);
          builder.calculateFee();
          transaction = builder.getResult();
          expect(transaction.to[0]).toEqual(BITCOIN_ADDRESS);
          expect(transaction.to[1]).toEqual(BITCOIN_ADDRESS);
          expect(transaction.from[0]).toEqual(BITCOIN_ADDRESS);
          expect(transaction.from[1]).toEqual(BITCOIN_ADDRESS);
          expect(transaction.amounts[0]).toEqual(0.0001 * Math.pow(10, 8));
          expect(transaction.amounts[1]).toEqual(0.0002 * Math.pow(10, 8));
          expect(transaction.changeAddress).toEqual(BITCOIN_ADDRESS);
          expect(transaction.inputs[0].script).not.toEqual(undefined);
          expect(transaction.fee).not.toEqual(0);

        case 21:
        case "end":
          return _context11.stop();
      }
    }
  }, _callee11);
})));
test('Test build bitcoin transaction with array params',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee12() {
  var outx, builder, transaction;
  return regeneratorRuntime.wrap(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          outx = {
            txId: '557bf23415160ce932ea5215e238132bf1cc42c1a7f91846d335d0d1e33cd19f',
            address: BITCOIN_ADDRESS,
            satoshis: 2538851,
            outputIndex: 1
          };
          builder = new transactions.BitcoinTxBuilder();
          builder.setFromAddress([BITCOIN_ADDRESS, BITCOIN_ADDRESS]);
          builder.setToAddress([BITCOIN_ADDRESS, BITCOIN_ADDRESS]);
          builder.setAmount([0.0001, 0.0002]);
          builder.setChangeAddress(BITCOIN_ADDRESS);
          builder.addOutx(outx);
          builder.calculateFee();
          transaction = builder.getResult();
          expect(transaction.to[0]).toEqual(BITCOIN_ADDRESS);
          expect(transaction.to[1]).toEqual(BITCOIN_ADDRESS);
          expect(transaction.from[0]).toEqual(BITCOIN_ADDRESS);
          expect(transaction.from[1]).toEqual(BITCOIN_ADDRESS);
          expect(transaction.amounts[0]).toEqual(0.0001 * Math.pow(10, 8));
          expect(transaction.amounts[1]).toEqual(0.0002 * Math.pow(10, 8));
          expect(transaction.changeAddress).toEqual(BITCOIN_ADDRESS);
          expect(transaction.inputs[0].script).not.toEqual(undefined);
          expect(transaction.fee).not.toEqual(0);

        case 18:
        case "end":
          return _context12.stop();
      }
    }
  }, _callee12);
})));
test('Test build ether contract tx',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee13() {
  var builder, transaction;
  return regeneratorRuntime.wrap(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          builder = new transactions.EtherContractTxBuilder();
          builder.setToAddress(ETHER_ADDRESS);
          builder.setMethodName('test');
          builder.setMethodParams([]);
          builder.setData('0x1');
          builder.setNonce(1);
          builder.setGasPrice(1000000000);
          builder.setGasLimit(21000);
          transaction = builder.getResult();
          expect(transaction.nonce).toEqual(1);
          expect(transaction.to).toEqual(ETHER_ADDRESS);
          expect(transaction.gasLimit).toEqual(ethers.utils.bigNumberify(21000));
          expect(transaction.gasPrice).toEqual(ethers.utils.bigNumberify(1000000000));
          expect(transaction.data).toEqual('0x1');

        case 14:
        case "end":
          return _context13.stop();
      }
    }
  }, _callee13);
})));
test('Test fail build ether contract tx',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee14() {
  var builder;
  return regeneratorRuntime.wrap(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          builder = new transactions.EtherContractTxBuilder();
          builder.setToAddress(ETHER_ADDRESS);
          builder.setMethodName('test');
          builder.setMethodParams([]);
          builder.setNonce(1);
          builder.setGasPrice(1000000000);
          builder.setGasLimit(21000);
          expect(builder.getResult().isCompleted()).not.toBeTruthy();

        case 8:
        case "end":
          return _context14.stop();
      }
    }
  }, _callee14);
})));
test('Test ether director builder',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee15() {
  var rawTx, builder, director, transaction;
  return regeneratorRuntime.wrap(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          rawTx = structures.EtherTransaction;
          rawTx.nonce = 1;
          rawTx.gasLimit = 21000;
          rawTx.gasPrice = 1000000000;
          rawTx.nonce = 1;
          rawTx.value = 2;
          rawTx.to = ETHER_ADDRESS;
          builder = new transactions.EtherTxBuilder();
          director = new transactions.TransactionConstructor(builder);
          transaction = director.buildEtherTx(rawTx);
          expect(transaction.nonce).toEqual(1);
          expect(transaction.to).toEqual(ETHER_ADDRESS);
          expect(transaction.value).toEqual(ethers.utils.parseEther('2'));
          expect(transaction.gasLimit).toEqual(ethers.utils.bigNumberify(21000));
          expect(transaction.gasPrice).toEqual(ethers.utils.bigNumberify(1000000000));

        case 15:
        case "end":
          return _context15.stop();
      }
    }
  }, _callee15);
})));
test('Test Ether Contract director builder',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee16() {
  var rawTx, builder, director, transaction;
  return regeneratorRuntime.wrap(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          rawTx = structures.EtherTransaction;
          rawTx.nonce = 1;
          rawTx.gasLimit = 21000;
          rawTx.gasPrice = 1000000000;
          rawTx.nonce = 1;
          rawTx.data = '0x1';
          rawTx.to = ETHER_ADDRESS;
          rawTx.abi = [];
          builder = new transactions.EtherContractTxBuilder();
          director = new transactions.TransactionConstructor(builder);
          transaction = director.buildEtherContractTx(rawTx, rawTx.abi);
          expect(transaction.nonce).toEqual(1);
          expect(transaction.to).toEqual(ETHER_ADDRESS);
          expect(transaction.gasLimit).toEqual(ethers.utils.bigNumberify(21000));
          expect(transaction.gasPrice).toEqual(ethers.utils.bigNumberify(1000000000));
          expect(transaction.data).toEqual('0x1');
          expect(transaction.methodName).toEqual(null);
          expect(transaction.methodParams).toEqual([]);

        case 18:
        case "end":
          return _context16.stop();
      }
    }
  }, _callee16);
})));
test('Test Bitcoin director builder',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee17() {
  var outx, builder, director, transaction, input;
  return regeneratorRuntime.wrap(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          outx = {
            txId: '557bf23415160ce932ea5215e238132bf1cc42c1a7f91846d335d0d1e33cd19f',
            address: BITCOIN_ADDRESS,
            satoshis: 2538851,
            outputIndex: 1
          };
          builder = new transactions.BitcoinTxBuilder();
          director = new transactions.TransactionConstructor(builder);
          transaction = director.buildBitcoinTx(outx, [BITCOIN_ADDRESS], [BITCOIN_ADDRESS, BITCOIN_ADDRESS], [0.0001, 0.0002], BITCOIN_ADDRESS);
          input = structures.BitcoinInput;
          input.address = BITCOIN_ADDRESS;
          input.outputIndex = outx.outputIndex;
          input.satoshis = outx.satoshis;
          input.script = new bitcore.Script(bitcore.Address(BITCOIN_ADDRESS)).toHex();
          input.txId = outx.txId;
          expect(transaction.fee).not.toEqual(0);
          expect(transaction.changeAddress).toEqual(BITCOIN_ADDRESS);
          expect(transaction.inputs[0]).toEqual(input);

        case 13:
        case "end":
          return _context17.stop();
      }
    }
  }, _callee17);
})));