"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var wallets = require('../walletcs');

var transactions = require('../transactions');

var parsers = require('../parsers');

var errors = require('../base/errors');

var ethers = require('ethers');

var bitcore = require('bitcore-lib');

test('Test create ether pair keys from mnemonic',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var wallet, addresses;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          wallet = new wallets.EtherWalletHD();
          _context.next = 3;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 3:
          addresses = _context.sent;
          expect(addresses.xPub).toEqual('xpub661MyMwAqRbcG42Nchfke9KUhfnD4BZKko2XrrPTCXaVmZNS9D7AGHFEEpVMF2ddCiRHxY4DGJVyHDsc69qS2Z8c4YCzKbgSpAcpAtuzGKb');
          expect(addresses.xPriv).toEqual('xprv9s21ZrQH143K3ZwuWg8kH1Nk9dwieiqUPa6w4TyqeC3Wtm3HbfnuiUvkPZMx6WcYAMcLphQJnnkautdLoVZmPiXunLdu5jqKPUwK6YDwxb6');

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
})));
test('Test generate ether mnemonic',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee2() {
  var mnemonic;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          mnemonic = wallets.EtherWalletHD.generateMnemonic();
          expect(mnemonic).toBeTruthy();

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, this);
})));
test('Test validation ether mnemonic',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee3() {
  var mnemonic;
  return regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          mnemonic = wallets.EtherWalletHD.generateMnemonic();
          expect(wallets.EtherWalletHD.validateMnemonic(mnemonic)).toBeTruthy();

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3, this);
})));
test('Test get number account from ether xPub',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee4() {
  var wallet, addresses, xpub, address;
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          wallet = new wallets.EtherWalletHD();
          _context4.next = 3;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 3:
          addresses = _context4.sent;
          xpub = addresses.xPub;
          address = wallet.getAddressFromXpub(xpub);
          expect(address).toEqual('0x343E60ACea58388fCba2C21F302312feCf55175A');

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee4, this);
})));
test('Test get number account from ether xprv',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee5() {
  var wallet, addresses, xprv, child1;
  return regeneratorRuntime.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          wallet = new wallets.EtherWalletHD();
          _context5.next = 3;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 3:
          addresses = _context5.sent;
          xprv = addresses.xPriv;
          child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
          expect(child1.address).toEqual('0x343E60ACea58388fCba2C21F302312feCf55175A');
          expect(child1.privateKey).toEqual('0x51778a8e47592afeaa55ca845cf27a4a8f996f9590d2694eac9b9fb2b5efd40a');

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  }, _callee5, this);
})));
test('Test sign ether transaction by privateKey',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee6() {
  var wallet, addresses, xprv, child1, tx, sinedTx;
  return regeneratorRuntime.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          wallet = new wallets.EtherWalletHD();
          _context6.next = 3;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 3:
          addresses = _context6.sent;
          xprv = addresses.xPriv;
          child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
          tx = new transactions.EtherTx();
          tx.to = '0x343E60ACea58388fCba2C21F302312feCf55175A';
          tx.gasPrice = ethers.utils.bigNumberify(1000000000);
          tx.gasLimit = ethers.utils.bigNumberify(21000);
          tx.value = ethers.utils.parseEther("0.0001");
          _context6.next = 13;
          return wallet.signTransactionByPrivateKey(child1.privateKey, tx);

        case 13:
          sinedTx = _context6.sent;
          expect(sinedTx).not.toEqual(undefined);

        case 15:
        case "end":
          return _context6.stop();
      }
    }
  }, _callee6, this);
})));
test('Test sign ether transaction by xPriv',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee7() {
  var wallet, addresses, xprv, child1, tx, sinedTx, xprvSinedTx;
  return regeneratorRuntime.wrap(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          wallet = new wallets.EtherWalletHD();
          _context7.next = 3;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 3:
          addresses = _context7.sent;
          xprv = addresses.xPriv;
          child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
          tx = new transactions.EtherTx();
          tx.to = '0x343E60ACea58388fCba2C21F302312feCf55175A';
          tx.gasPrice = ethers.utils.bigNumberify(1000000000);
          tx.gasLimit = ethers.utils.bigNumberify(21000);
          tx.value = ethers.utils.parseEther("0.0001");
          _context7.next = 13;
          return wallet.signTransactionByPrivateKey(child1.privateKey, tx);

        case 13:
          sinedTx = _context7.sent;
          _context7.next = 16;
          return wallet.signTransactionByxPriv(xprv, tx, [child1.address]);

        case 16:
          xprvSinedTx = _context7.sent;
          expect(sinedTx).toEqual(xprvSinedTx);

        case 18:
        case "end":
          return _context7.stop();
      }
    }
  }, _callee7, this);
})));
test('Test generate bitcoin mnemonic',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee8() {
  var mnemonic;
  return regeneratorRuntime.wrap(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          mnemonic = wallets.BitcoinWalletHD.generateMnemonic();
          expect(mnemonic).toBeTruthy();

        case 2:
        case "end":
          return _context8.stop();
      }
    }
  }, _callee8, this);
})));
test('Test validate bitcoin mnemonic',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee9() {
  var mnemonic;
  return regeneratorRuntime.wrap(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          mnemonic = wallets.BitcoinWalletHD.generateMnemonic();
          expect(wallets.BitcoinWalletHD.validateMnemonic(mnemonic)).toBeTruthy();

        case 2:
        case "end":
          return _context9.stop();
      }
    }
  }, _callee9, this);
})));
test('Test create bitcoin pair keys from mnemonic',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee10() {
  var wallet, addresses;
  return regeneratorRuntime.wrap(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          wallet = new wallets.BitcoinWalletHD('test3');
          _context10.next = 3;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 3:
          addresses = _context10.sent;
          expect(addresses.xPub).toEqual('tpubD6NzVbkrYhZ4XrDE4teqr4er2nss3a4PJRcqDQSbYSLPWr39DRxFQiv4Ura8mXarzcxCa7a5oQL1yQNDV1gfuzau88xJ18LgQ8DDvzYk8kY');
          expect(addresses.xPriv).toEqual('tprv8ZgxMBicQKsPePBSBEzFSezjTmMvtEsUj823vtQJ8AXzgMnNb38fEEJCJjXc6szrXo97po24x9LPNkB5vhuiCmoWJyrCk6ZNJagjYBAonGS');

        case 6:
        case "end":
          return _context10.stop();
      }
    }
  }, _callee10, this);
})));
test('Get bitcoin address from xpub',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee11() {
  var network, wallet, addresses, xpub, address;
  return regeneratorRuntime.wrap(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          network = 'test3';
          wallet = new wallets.BitcoinWalletHD(network);
          _context11.next = 4;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 4:
          addresses = _context11.sent;
          xpub = addresses.xPub;
          address = wallet.getAddressFromXpub(xpub, 0, network);
          expect('mxztRthVNEED7372vRhEQWuZ16A1qMQriZ').toEqual(address);

        case 8:
        case "end":
          return _context11.stop();
      }
    }
  }, _callee11, this);
})));
test('Test bitcoin get number account from xprv',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee12() {
  var network, wallet, addresses, xprv, child1;
  return regeneratorRuntime.wrap(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          network = 'test3';
          wallet = new wallets.BitcoinWalletHD(network);
          _context12.next = 4;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 4:
          addresses = _context12.sent;
          xprv = addresses.xPriv;
          child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0, network);
          expect('mxztRthVNEED7372vRhEQWuZ16A1qMQriZ').toEqual(child1.address);

        case 8:
        case "end":
          return _context12.stop();
      }
    }
  }, _callee12, this);
})));
test('Test bitcoin get xpub from xprv',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee13() {
  var network, wallet, addresses, xprv, recovered;
  return regeneratorRuntime.wrap(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          network = 'test3';
          wallet = new wallets.BitcoinWalletHD(network);
          _context13.next = 4;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 4:
          addresses = _context13.sent;
          xprv = addresses.xPriv;
          recovered = wallet.getxPubFromXprv(xprv, network);
          expect(recovered).toEqual(addresses.xPub);

        case 8:
        case "end":
          return _context13.stop();
      }
    }
  }, _callee13, this);
})));
test('Test sign bitcoin transaction by privateKey',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee14() {
  var network, wallet, addresses, xprv, child1, bitcoinFileTx, unsigedTxs, tx, sinedTx;
  return regeneratorRuntime.wrap(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          network = 'test3';
          wallet = new wallets.BitcoinWalletHD(network);
          _context14.next = 4;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 4:
          addresses = _context14.sent;
          xprv = addresses.xPriv;
          child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
          bitcoinFileTx = {
            "outx": [{
              "txId": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
              "outputIndex": 2,
              "address": child1.address,
              "satoshis": 8847983
            }, {
              "txId": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
              "outputIndex": 1,
              "address": child1.address,
              "satoshis": 20000
            }, {
              "txId": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
              "outputIndex": 0,
              "address": child1.address,
              "satoshis": 10000
            }],
            "from": [child1.address],
            "to": ["mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X", "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X"],
            "amount": [10000, 110000],
            "changeAddress": child1.address,
            "fee": null
          };
          unsigedTxs = parsers.JSONParser.parseFile(JSON.stringify(bitcoinFileTx));
          tx = unsigedTxs[0];
          _context14.next = 12;
          return wallet.signTransactionByPrivateKey(child1.privateKey, tx);

        case 12:
          sinedTx = _context14.sent;
          expect(sinedTx).not.toEqual(undefined);

        case 14:
        case "end":
          return _context14.stop();
      }
    }
  }, _callee14, this);
})));
test('Test sign bitcoin transaction by i',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee15() {
  var network, wallet, addresses, xprv, child1, bitcoinFileTx, unsigedTxs, tx, sinedTx, xprvSinedTx;
  return regeneratorRuntime.wrap(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          network = 'test3';
          wallet = new wallets.BitcoinWalletHD(network);
          _context15.next = 4;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 4:
          addresses = _context15.sent;
          xprv = addresses.xPriv;
          child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
          bitcoinFileTx = {
            "outx": [{
              "txId": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
              "outputIndex": 2,
              "address": child1.address,
              "satoshis": 8847983
            }, {
              "txId": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
              "outputIndex": 1,
              "address": child1.address,
              "satoshis": 20000
            }, {
              "txId": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
              "outputIndex": 0,
              "address": child1.address,
              "satoshis": 10000
            }],
            "from": [child1.address],
            "to": ["mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X", "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X"],
            "amount": [10000, 110000],
            "changeAddress": child1.address,
            "fee": null
          };
          unsigedTxs = parsers.JSONParser.parseFile(JSON.stringify(bitcoinFileTx));
          tx = unsigedTxs[0];
          _context15.next = 12;
          return wallet.signTransactionByPrivateKey(child1.privateKey, tx);

        case 12:
          sinedTx = _context15.sent;
          _context15.next = 15;
          return wallet.signTransactionByxPriv(xprv, tx, [child1.address]);

        case 15:
          xprvSinedTx = _context15.sent;
          expect(sinedTx).toEqual(xprvSinedTx);

        case 17:
        case "end":
          return _context15.stop();
      }
    }
  }, _callee15, this);
})));
test('Test create bitcoin xPriv with bad mnemonic',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee16() {
  var network, wallet;
  return regeneratorRuntime.wrap(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          network = 'test3';
          wallet = new wallets.BitcoinWalletHD(network);
          _context16.next = 4;
          return expect(wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp')).rejects.toThrowError(errors.MNEMONIC);

        case 4:
        case "end":
          return _context16.stop();
      }
    }
  }, _callee16, this);
})));
test('Test create ether xPriv with bad mnemonic',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee17() {
  var wallet;
  return regeneratorRuntime.wrap(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          wallet = new wallets.EtherWalletHD();
          _context17.next = 3;
          return expect(wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp')).rejects.toThrowError(errors.MNEMONIC);

        case 3:
        case "end":
          return _context17.stop();
      }
    }
  }, _callee17, this);
})));
test('Test create bitcoin address/PrivateKey with bad xPriv',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee18() {
  var network, wallet, addresses, xprv;
  return regeneratorRuntime.wrap(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          network = 'test3';
          wallet = new wallets.BitcoinWalletHD(network);
          _context18.next = 4;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 4:
          addresses = _context18.sent;
          xprv = addresses.xPriv;
          expect(function () {
            wallet.getAddressWithPrivateFromXprv(xprv + '!', 0);
          }).toThrowError(errors.XPRIV);

        case 7:
        case "end":
          return _context18.stop();
      }
    }
  }, _callee18, this);
})));
test('Test create ether address/PrivateKey with bad xPriv',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee19() {
  var wallet, addresses, xprv;
  return regeneratorRuntime.wrap(function _callee19$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          wallet = new wallets.EtherWalletHD();
          _context19.next = 3;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 3:
          addresses = _context19.sent;
          xprv = addresses.xPriv;
          expect(function () {
            wallet.getAddressWithPrivateFromXprv(xprv + '!', 0);
          }).toThrowError(errors.XPRIV);

        case 6:
        case "end":
          return _context19.stop();
      }
    }
  }, _callee19, this);
})));
test('Test create bitcoin address/PrivateKey with bad privateKey',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee20() {
  var network, wallet, addresses, xprv, child1, bitcoinFileTx, unsigedTxs, tx;
  return regeneratorRuntime.wrap(function _callee20$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          network = 'test3';
          wallet = new wallets.BitcoinWalletHD(network);
          _context20.next = 4;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 4:
          addresses = _context20.sent;
          xprv = addresses.xPriv;
          child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
          bitcoinFileTx = {
            "outx": [{
              "txId": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
              "outputIndex": 2,
              "address": child1.address,
              "satoshis": 8847983
            }, {
              "txId": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
              "outputIndex": 1,
              "address": child1.address,
              "satoshis": 20000
            }, {
              "txId": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
              "outputIndex": 0,
              "address": child1.address,
              "satoshis": 10000
            }],
            "from": [child1.address],
            "to": ["mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X", "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X"],
            "amount": [10000, 110000],
            "changeAddress": child1.address,
            "fee": null
          };
          unsigedTxs = parsers.JSONParser.parseFile(JSON.stringify(bitcoinFileTx));
          tx = unsigedTxs[0];
          _context20.next = 12;
          return expect(wallet.signTransactionByPrivateKey(child1.privateKey + '1', tx)).rejects.toThrowError(errors.PRIVATE_KEY);

        case 12:
        case "end":
          return _context20.stop();
      }
    }
  }, _callee20, this);
})));
test('Test create ether address/PrivateKey with bad privateKey',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee21() {
  var wallet, addresses, xprv, child1, tx;
  return regeneratorRuntime.wrap(function _callee21$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          wallet = new wallets.EtherWalletHD();
          _context21.next = 3;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 3:
          addresses = _context21.sent;
          xprv = addresses.xPriv;
          child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
          tx = new transactions.EtherTx();
          tx.to = '0x343E60ACea58388fCba2C21F302312feCf55175A';
          tx.gasPrice = ethers.utils.bigNumberify(1000000000);
          tx.gasLimit = ethers.utils.bigNumberify(21000);
          tx.value = ethers.utils.parseEther("0.0001");
          _context21.next = 13;
          return expect(wallet.signTransactionByPrivateKey(child1.privateKey + '1', tx)).rejects.toThrowError(errors.PRIVATE_KEY);

        case 13:
        case "end":
          return _context21.stop();
      }
    }
  }, _callee21, this);
})));
test('Test create multisign address',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee22() {
  var network, wallet, addresses, xprv, pair1, pair2, publicKeys, multiSignAddress;
  return regeneratorRuntime.wrap(function _callee22$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          network = 'test3';
          wallet = new wallets.BitcoinWalletHD(network);
          _context22.next = 4;
          return wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');

        case 4:
          addresses = _context22.sent;
          xprv = addresses.xPriv;
          pair1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
          pair2 = wallet.getAddressWithPrivateFromXprv(xprv, 1);
          publicKeys = [pair2.privateKey, pair1.privateKey].map(function (key) {
            return wallets.BitcoinWalletHD.getPublicKeyFromPrivateKey(key);
          });
          multiSignAddress = wallets.BitcoinWalletHD.createMultiSignAddress(2, 'main', publicKeys);
          expect(multiSignAddress).not.toEqual('39vQqW5Ykt5C66FfV2J6UApUEkLkcAKuqj');

        case 11:
        case "end":
          return _context22.stop();
      }
    }
  }, _callee22, this);
})));
test('Test create multisign tx',
/*#__PURE__*/
_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee23() {
  return regeneratorRuntime.wrap(function _callee23$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
        case "end":
          return _context23.stop();
      }
    }
  }, _callee23, this);
})));