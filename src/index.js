const transactions = require("./ether");
const bitcoin = require("./bitcoin");
const walletcs = require("./walletcs_old");
const utils = require("./utils");

module.exports = {
  EtherKeyPair: transactions.EtherWallet,
  EtherTransaction: transactions.EtherTransaction,
  EtherTransactionDecoder: transactions.EtherTransactionDecoder,
  FileTransactionGenerator: walletcs.FileTransactionGenerator,
  FileTransactionReader: walletcs.FileTransactionReader,
  checkPrivateKey: walletcs.checkPrivateKey,
  checkAddress: walletcs.checkAddress,
  BitcoinTransaction: bitcoin.BitcoinTransaction,
  checkBitcoinAddress: bitcoin.checkBitcoinAdress,
  BitcoinCheckPair: bitcoin.BitcoinWallet,
  addressIsMainNet: bitcoin.addressIsMainNet,
  privateKeyIsMainNet: bitcoin.privateKeyIsMainNet,
  representEthTx: transactions.representEthTx,
  representBtcTx: bitcoin.representBtcTx,
  ConverterEtherCSVToTxObject: utils.ConverterEtherCSVToTxObject,
  ConverterBitcoinCSVToTxObject: utils.ConverterBitcoinCSVToTxObject
};
