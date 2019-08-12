import {ConverterBitcoinCSVToTxObject} from "./utils";

const transactions = require("./ether/transactions");
const bitcoin = require("./bitcoin/transactions");
const walletcs = require("./walletcs");
const utils = require("./utils");

module.exports = {
  EtherKeyPair: transactions.EtherKeyPair,
  EtherTransaction: transactions.EtherTransaction,
  EtherTransactionDecoder: transactions.EtherTransactionDecoder,
  FileTransactionGenerator: walletcs.FileTransactionGenerator,
  FileTransactionReader: walletcs.FileTransactionReader,
  checkPrivateKey: walletcs.checkPrivateKey,
  checkAddress: walletcs.checkAddress,
  BitcoinTransaction: bitcoin.TransactionBitcoin,
  checkBitcoinAddress: bitcoin.checkBitcoinAdress,
  BitcoinCheckPair: bitcoin.BitcoinCheckPair,
  addressIsMainNet: bitcoin.addressIsMainNet,
  privateKeyIsMainNet: bitcoin.privateKeyIsMainNet,
  representEthTx: transactions.representEthTx,
  representBtcTx: bitcoin.representBtcTx,
  ConverterEtherCSVToTxObject: utils.ConverterEtherCSVToTxObject,
  ConverterBitcoinCSVToTxObject: utils.ConverterBitcoinCSVToTxObject
};
