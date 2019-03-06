const transactions = require('./ether/transactions');
const walletcs = require('./ether/walletcs-ether');

module.exports = {
  EtherKeyPair: transactions.EtherKeyPair,
  EtherTransaction: transactions.EtherTransaction,
  EtherTransactionDecoder: transactions.EtherTransactionDecoder,
  FileTransactionGenerator: walletcs.FileTransactionGenerator,
  FileTransactionReader: walletcs.FileTransactionReader,
  checkPrivateKey: walletcs.checkPrivateKey,
  checkAddress: walletcs.checkAddress
};
