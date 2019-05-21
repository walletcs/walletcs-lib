const transactions = require("./ether/transactions");
const bitcoin = require("./bitcoin/transactions");
const walletcs = require("./walletcs");

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
  representTx: transactions.representTx
};
