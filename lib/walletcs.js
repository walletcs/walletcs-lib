"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.privateKeyIsMainNet = exports.addressIsMainNet = exports.checkBitcoinAdress = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ethers = require('ethers');

var bip39 = require('bip39');

var bip32 = require('bip32');

var bitcoinjs = require('bitcoinjs-lib');

var bitcore = require('bitcore-lib');

var walletcs = require('./base/walletc');

var transactions = require('./transactions');

var structures = require('./base/structures');

var errors = require('./base/errors');

var _ = require('lodash');

var SEARCH_DEPTH = 1000;

function convertToBitcoreTx(data) {
  var tx = bitcore.Transaction();
  tx.from(data.from);
  tx.to(data.to);
  tx.change(data.changeAddress);
  tx.fee(data.fee);
  return tx;
} // function convertToWalletCSTx(data) {
//   const _tx = new bitcore.Transaction(data);
//   const tx = structures.BitcoinFileTransaction;
//   tx.changeAddress =
// }


function _chooseNetwork(network) // Choose between two networks testnet and main
{
  if (!network && (network !== 'test3' || network !== 'main')) {
    throw Error('network parameter is required and must be one of "main" or "test3"');
  }

  if (network === 'test3') {
    return bitcoinjs.networks.testnet;
  } else {
    return bitcoinjs.networks.bitcoin;
  }
}

;

function _convertNetworkBitcoinjsToBitcore(network) {
  if (network === 'test3') return 'testnet';
  return 'livenet';
}

function getAddress(node, network) {
  return bitcoinjs.payments.p2pkh({
    pubkey: node.publicKey,
    network: network
  }).address;
}

var checkBitcoinAdress = function checkBitcoinAdress(address) {
  if (address.length < 26 || address.length > 35) {
    return false;
  }

  var re = /^[A-Z0-9]+$/i;
  return re.test(address);
};

exports.checkBitcoinAdress = checkBitcoinAdress;

var addressIsMainNet = function addressIsMainNet(address) {
  var prefixes = ['1', '3', 'xpub', 'bc1'];

  for (var i = 0; i < prefixes.length; i += 1) {
    if (address.startsWith(prefixes[i])) {
      return true;
    }
  }

  return false;
};

exports.addressIsMainNet = addressIsMainNet;

var privateKeyIsMainNet = function privateKeyIsMainNet(pr) {
  var prefixes = ['K', 'L', '5', 'xprv'];

  for (var i = 0; i < prefixes.length; i += 1) {
    if (pr.startsWith(pr[i])) {
      return true;
    }
  }

  return false;
};

exports.privateKeyIsMainNet = privateKeyIsMainNet;

var BitcoinWalletHD =
/*#__PURE__*/
function (_walletcs$WalletHDInt) {
  _inherits(BitcoinWalletHD, _walletcs$WalletHDInt);

  function BitcoinWalletHD(network) {
    var _this;

    _classCallCheck(this, BitcoinWalletHD);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BitcoinWalletHD).call(this));
    _this.network = _chooseNetwork(network);
    return _this;
  } // BIP39


  _createClass(BitcoinWalletHD, [{
    key: "createMultiSignTx",
    value: function createMultiSignTx(data) {
      var threshold = data.threshold;

      if (!threshold) {
        threshold = data.from.length;
      }

      var builder = new transactions.BitcoinTxBuilder();
      var director = new transactions.TransactionConstructor(builder);
      var unsignedTx = director.buildBitcoinMultiSignTx(data.outx, data.from, data.to, data.changeAddress, data.fee, threshold);
      return unsignedTx;
    }
  }, {
    key: "combineMultiSignSignatures",
    value: function combineMultiSignSignatures(multiSignTxs) {
      var self = this;

      var tx = self.__builtTx(multiSignTxs.shift());

      _.each(multiSignTxs, function (tr) {
        _.each(self.__getSignatures(tr), function (signature) {
          tx.applySignature(signature);
        });
      });

      return this.__combineSignatures(multiSignTxs[0], tx);
    }
  }, {
    key: "__getSignatures",
    value: function __getSignatures(tx) {
      var result = [];

      _.each(tx.inputs, function (input) {
        _.each(input.signatures, function (sign) {
          if (sign) {
            result.push(new bitcore.Transaction.Signature(sign));
          }
        });
      });

      return result;
    }
  }, {
    key: "__builtTx",
    value: function __builtTx(unsignedTx) {
      try {
        var tx = new bitcore.Transaction();

        if (unsignedTx.threshold) {
          tx.from(unsignedTx.inputs, unsignedTx.from, unsignedTx.threshold);
        } else {
          tx.from(unsignedTx.inputs);
        }

        tx.to(unsignedTx.to);
        tx.change(unsignedTx.changeAddress);

        _.each(this.__getSignatures(unsignedTx), function (signature) {
          tx.applySignature(signature);
        });

        return tx;
      } catch (e) {
        throw Error(errors.TX_FORMAT);
      }
    }
  }, {
    key: "getFromMnemonic",
    value: function () {
      var _getFromMnemonic = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(mnemonic) {
        var seed, root;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (bip39.validateMnemonic(mnemonic)) {
                  _context.next = 2;
                  break;
                }

                throw Error(errors.MNEMONIC);

              case 2:
                _context.next = 4;
                return bip39.mnemonicToSeed(mnemonic);

              case 4:
                seed = _context.sent;
                root = bip32.fromSeed(seed, this.network);
                return _context.abrupt("return", {
                  'xPub': root.neutered().toBase58(),
                  'xPriv': root.toBase58()
                });

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getFromMnemonic(_x) {
        return _getFromMnemonic.apply(this, arguments);
      }

      return getFromMnemonic;
    }() // BIP32

  }, {
    key: "getAddressFromXpub",
    value: function getAddressFromXpub(xpub, index) {
      // Use BIP32 method for get child key
      try {
        var address = bitcoinjs.payments.p2pkh({
          pubkey: bip32.fromBase58(xpub, this.network).derive(0).derive(parseInt(index)).publicKey,
          network: this.network
        }).address;
        return address;
      } catch (e) {
        throw Error(errors.XPUB);
      }
    }
  }, {
    key: "getxPubFromXprv",
    value: function getxPubFromXprv(xpriv) {
      try {
        var node = bip32.fromBase58(xpriv, this.network);
        return node.neutered().toBase58();
      } catch (e) {
        throw Error(errors.XPRIV);
      }
    }
  }, {
    key: "getAddressWithPrivateFromXprv",
    value: function getAddressWithPrivateFromXprv(xpriv, number_address) {
      // Use BIP32 method for get child key
      try {
        var root = bip32.fromBase58(xpriv, this.network);
        var child1b = root.derive(0).derive(number_address);
        return {
          'address': getAddress(child1b, this.network),
          'privateKey': child1b.toWIF(),
          'publicKey': child1b.publicKey.toString('hex')
        };
      } catch (e) {
        throw Error(errors.XPRIV);
      }
    }
  }, {
    key: "searchAddressInParent",
    value: function searchAddressInParent(xpriv, address, depth) {
      for (var i = 0; i <= (depth || SEARCH_DEPTH); i += 1) {
        var pair = this.getAddressWithPrivateFromXprv(xpriv, i);

        if (pair.address === address) {
          return pair;
        }

        if (i >= depth || SEARCH_DEPTH) {
          return null;
        }
      }
    }
  }, {
    key: "signTransactionByPrivateKey",
    value: function () {
      var _signTransactionByPrivateKey = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(prv, unsignedTx) {
        var tx;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                tx = this.__builtTx(unsignedTx);
                tx.sign(new bitcore.PrivateKey(prv));
                return _context2.abrupt("return", tx.uncheckedSerialize());

              case 6:
                _context2.prev = 6;
                _context2.t0 = _context2["catch"](0);
                throw Error(errors.PRIVATE_KEY);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 6]]);
      }));

      function signTransactionByPrivateKey(_x2, _x3) {
        return _signTransactionByPrivateKey.apply(this, arguments);
      }

      return signTransactionByPrivateKey;
    }()
  }, {
    key: "signMultiSignTransactionByPrivateKey",
    value: function () {
      var _signMultiSignTransactionByPrivateKey = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(prv, unsignedTx) {
        var tx;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                tx = this.__builtTx(unsignedTx);
                tx.sign(new bitcore.PrivateKey(prv));
                return _context3.abrupt("return", this.__combineSignatures(unsignedTx, tx));

              case 6:
                _context3.prev = 6;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw Error(errors.PRIVATE_KEY);

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 6]]);
      }));

      function signMultiSignTransactionByPrivateKey(_x4, _x5) {
        return _signMultiSignTransactionByPrivateKey.apply(this, arguments);
      }

      return signMultiSignTransactionByPrivateKey;
    }()
  }, {
    key: "__combineSignatures",
    value: function __combineSignatures(unsignedTx, signedTx) {
      _.each(unsignedTx.inputs, function (input, index) {
        unsignedTx.inputs[index].signatures = _.map(signedTx.inputs[index].signatures, function (signature) {
          if (signature) return signature.toJSON();
        });
      });

      return unsignedTx;
    }
  }, {
    key: "signTransactionByxPriv",
    value: function () {
      var _signTransactionByxPriv = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(xpriv, unsignedTx, addresses, depth) {
        var tx, i, pair;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                tx = this.__builtTx(unsignedTx);
                i = 0;

              case 2:
                if (!(i < addresses.length)) {
                  _context4.next = 10;
                  break;
                }

                pair = this.searchAddressInParent(xpriv, addresses[i], depth);

                if (pair) {
                  tx.sign(new bitcore.PrivateKey(pair.privateKey));
                }

                if (!tx.isFullySigned()) {
                  _context4.next = 7;
                  break;
                }

                return _context4.abrupt("return", tx.serialize());

              case 7:
                i += 1;
                _context4.next = 2;
                break;

              case 10:
                return _context4.abrupt("return", null);

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function signTransactionByxPriv(_x6, _x7, _x8, _x9) {
        return _signTransactionByxPriv.apply(this, arguments);
      }

      return signTransactionByxPriv;
    }()
  }], [{
    key: "generateMnemonic",
    value: function generateMnemonic() {
      return bip39.generateMnemonic();
    }
  }, {
    key: "validateMnemonic",
    value: function validateMnemonic(mnemonic) {
      return bip39.validateMnemonic(mnemonic);
    }
  }, {
    key: "createMultiSignAddress",
    value: function createMultiSignAddress(required, network, addresses) {
      var address = new bitcore.Address(addresses, required, _convertNetworkBitcoinjsToBitcore(network));
      return address.toString();
    }
  }, {
    key: "getPublicKeyFromPrivateKey",
    value: function getPublicKeyFromPrivateKey(privateKey) {
      var publicKey = bitcore.PublicKey(bitcore.PrivateKey(privateKey));
      return publicKey.toString();
    }
  }]);

  return BitcoinWalletHD;
}(walletcs.WalletHDInterface);

var EtherWalletHD =
/*#__PURE__*/
function (_walletcs$WalletHDInt2) {
  _inherits(EtherWalletHD, _walletcs$WalletHDInt2);

  function EtherWalletHD() {
    _classCallCheck(this, EtherWalletHD);

    return _possibleConstructorReturn(this, _getPrototypeOf(EtherWalletHD).apply(this, arguments));
  }

  _createClass(EtherWalletHD, [{
    key: "createTx",
    value: function createTx(unsignedTx) {
      var tx = this.__builtTx(unsignedTx);

      return tx.toJSON();
    }
  }, {
    key: "__builtTx",
    value: function __builtTx(unsignedTx) {
      var tx = unsignedTx.getTx();
      if (!tx) throw errors.TX_FORMAT;
      return tx;
    }
  }, {
    key: "getFromMnemonic",
    value: function () {
      var _getFromMnemonic2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(mnemonic) {
        var node;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (ethers.utils.HDNode.isValidMnemonic(mnemonic)) {
                  _context5.next = 2;
                  break;
                }

                throw Error(errors.MNEMONIC);

              case 2:
                node = ethers.utils.HDNode.fromMnemonic(mnemonic);
                return _context5.abrupt("return", {
                  'xPub': node.neuter().extendedKey,
                  'xPriv': node.extendedKey
                });

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getFromMnemonic(_x10) {
        return _getFromMnemonic2.apply(this, arguments);
      }

      return getFromMnemonic;
    }()
  }, {
    key: "getAddressWithPrivateFromXprv",
    value: function getAddressWithPrivateFromXprv(xpriv, number_address) {
      // Use BIP32 method for get child key
      try {
        var root = ethers.utils.HDNode.fromExtendedKey(xpriv);
        var standardEthereum = root.derivePath("0/".concat(number_address || 0));
        return {
          'address': standardEthereum.address,
          'privateKey': standardEthereum.privateKey,
          'publicKey': standardEthereum.publicKey.toString()
        };
      } catch (e) {
        throw Error(errors.XPRIV);
      }
    }
  }, {
    key: "getAddressFromXpub",
    value: function getAddressFromXpub(xpub, number_address) {
      // Use BIP32 method for get child key
      try {
        var root = ethers.utils.HDNode.fromExtendedKey(xpub);
        var standardEthereum = root.derivePath("0/".concat(number_address || 0));
        return standardEthereum.address;
      } catch (e) {
        throw Error(errors.XPUB);
      }
    }
  }, {
    key: "searchAddressInParent",
    value: function searchAddressInParent(xpriv, address, depth) {
      for (var i = 0; i <= (depth || SEARCH_DEPTH); i += 1) {
        var pair = this.getAddressWithPrivateFromXprv(xpriv, i);

        if (pair.address === address) {
          return pair;
        }

        if (i >= depth || SEARCH_DEPTH) {
          return null;
        }
      }
    }
  }, {
    key: "signTransactionByPrivateKey",
    value: function () {
      var _signTransactionByPrivateKey2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(prv, unsignedTx) {
        var tx, wallet;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                tx = this.__builtTx(unsignedTx);
                _context6.prev = 1;
                wallet = new ethers.Wallet(prv);
                _context6.next = 5;
                return wallet.sign(tx);

              case 5:
                return _context6.abrupt("return", _context6.sent);

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](1);
                throw Error(errors.PRIVATE_KEY);

              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[1, 8]]);
      }));

      function signTransactionByPrivateKey(_x11, _x12) {
        return _signTransactionByPrivateKey2.apply(this, arguments);
      }

      return signTransactionByPrivateKey;
    }()
  }, {
    key: "signTransactionByxPriv",
    value: function () {
      var _signTransactionByxPriv2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(xpriv, unsignedTx, addresses, depth) {
        var i, pair;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                i = 0;

              case 1:
                if (!(i < addresses.length)) {
                  _context7.next = 10;
                  break;
                }

                pair = this.searchAddressInParent(xpriv, addresses[i], depth);

                if (!pair) {
                  _context7.next = 7;
                  break;
                }

                _context7.next = 6;
                return this.signTransactionByPrivateKey(pair.privateKey, unsignedTx);

              case 6:
                return _context7.abrupt("return", _context7.sent);

              case 7:
                i += 1;
                _context7.next = 1;
                break;

              case 10:
                return _context7.abrupt("return", null);

              case 11:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function signTransactionByxPriv(_x13, _x14, _x15, _x16) {
        return _signTransactionByxPriv2.apply(this, arguments);
      }

      return signTransactionByxPriv;
    }()
  }], [{
    key: "generateMnemonic",
    value: function generateMnemonic() {
      return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16));
    }
  }, {
    key: "validateMnemonic",
    value: function validateMnemonic(mnemonic) {
      return ethers.utils.HDNode.isValidMnemonic(mnemonic);
    }
  }]);

  return EtherWalletHD;
}(walletcs.WalletHDInterface);

module.exports = {
  BitcoinWalletHD: BitcoinWalletHD,
  EtherWalletHD: EtherWalletHD
};