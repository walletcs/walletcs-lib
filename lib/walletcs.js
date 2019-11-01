"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.privateKeyIsMainNet = exports.addressIsMainNet = exports.checkBitcoinAdress = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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
  (0, _inherits2["default"])(BitcoinWalletHD, _walletcs$WalletHDInt);

  function BitcoinWalletHD(network) {
    var _this;

    (0, _classCallCheck2["default"])(this, BitcoinWalletHD);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BitcoinWalletHD).call(this));
    _this.network = _chooseNetwork(network);
    return _this;
  } // BIP39


  (0, _createClass2["default"])(BitcoinWalletHD, [{
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

        if (unsignedTx.changeAddress) {
          tx.change(unsignedTx.changeAddress);
        }

        ;

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
      var _getFromMnemonic = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(mnemonic) {
        var seed, root;
        return _regenerator["default"].wrap(function _callee$(_context) {
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
      var _signTransactionByPrivateKey = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(prv, unsignedTx) {
        var tx;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
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
      var _signMultiSignTransactionByPrivateKey = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(prv, unsignedTx) {
        var tx;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
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
      var _signTransactionByxPriv = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(xpriv, unsignedTx, addresses, depth) {
        var tx, i, pair;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
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
  (0, _inherits2["default"])(EtherWalletHD, _walletcs$WalletHDInt2);

  function EtherWalletHD() {
    (0, _classCallCheck2["default"])(this, EtherWalletHD);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EtherWalletHD).apply(this, arguments));
  }

  (0, _createClass2["default"])(EtherWalletHD, [{
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
      var _getFromMnemonic2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(mnemonic) {
        var node;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
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
        }, _callee5);
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
      var _signTransactionByPrivateKey2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(prv, unsignedTx) {
        var tx, wallet;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
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
      var _signTransactionByxPriv2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(xpriv, unsignedTx, addresses, depth) {
        var i, pair;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
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