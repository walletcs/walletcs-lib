"use strict";

var Outx = {
  address: '',
  // String
  satoshis: 0,
  // Integer
  txId: '',
  // String
  outputIndex: '' // String

};
var EtherTransaction = {
  to: [],
  // List[<TransactionTo>]
  from: [],
  // List[<TransactionFrom>]
  data: '0x',
  // String
  nonce: 0,
  // Integer
  gasLimit: 0,
  // Integer
  gasPrice: 0 // Integer

};
var EtherFileTransaction = {
  transactions: [],
  // List[<EtherTransaction>]
  contracts: [] // List[<ABI>]

};
var BitcoinFileTransaction = {
  from: [],
  // List[<TransactionFrom>]
  to: [],
  // List[<TransactionTo>]
  fee: 0,
  // Float
  outx: [] // List[<Outx>]

};
var BitcoinTransactionFrom = {
  address: '',
  // String
  change: false // Bool

};
var EtherTransactionFrom = {
  address: '' // String

};
var TransactionTo = {
  address: '',
  // String
  amount: 0.0 // Float

};
var ContractTransactionTo = {
  address: '' // String

};
var BitcoinInput = {
  txId: '',
  // String
  outputIndex: '',
  // String
  address: '',
  // String
  satoshis: '',
  // String
  script: '',
  // String
  signatures: [] // String

};
var Signature = {
  publicKey: '',
  prevTxId: '',
  outputIndex: '',
  inputIndex: '',
  signature: '',
  sigtype: ''
};
module.exports = {
  Outx: Outx,
  EtherTransaction: EtherTransaction,
  EtherFileTransaction: EtherFileTransaction,
  BitcoinFileTransaction: BitcoinFileTransaction,
  BitcoinInput: BitcoinInput,
  Signature: Signature,
  EtherTransactionFrom: EtherTransactionFrom,
  BitcoinTransactionFrom: BitcoinTransactionFrom,
  TransactionTo: TransactionTo,
  ContractTransactionTo: ContractTransactionTo
};