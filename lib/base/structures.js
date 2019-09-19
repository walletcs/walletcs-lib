"use strict";

require("@babel/register");

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
  data: '0x',
  // String
  nonce: 0,
  // Integer
  gasLimit: 0,
  // Integer
  gasPrice: 0,
  // Integer
  value: 0 // Integer

};
var EtherContractTransaction = {
  to: '',
  // String
  data: '0x',
  // String
  nonce: 0,
  // Integer
  gasLimit: 0,
  // Integer
  gasPrice: 0 // Integer

};
var EtherFileTransaction = {
  pubKey: '',
  // String
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
  changeAddress: '',
  // String
  outx: [] // List[<Outx>]

};
var TransactionFrom = {
  address: '',
  // String
  change: false // Bool

};
var TransactionTo = {
  address: '',
  // String
  amount: 0.0 // Float

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
  EtherContractTransaction: EtherContractTransaction,
  Signature: Signature
};