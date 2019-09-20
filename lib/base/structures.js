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
  to: '',
  // String
  data: '0x',
  // String
  nonce: 0,
  // Integer
  gasLimit: 0,
  // Integer
  gasPrice: 0,
  // Integer
  from: '',
  // String
  value: 0 // Integer

};
var EtherContractTransaction = {
  to: '',
  // String
  from: '',
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
  // List[String]
  to: [],
  // List[String]
  amount: [],
  // List[Float]
  fee: 0,
  // Float
  changeAddress: '',
  // String
  outx: [] // List[<Outx>]

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
  script: '' // String

};
module.exports = {
  Outx: Outx,
  EtherTransaction: EtherTransaction,
  EtherFileTransaction: EtherFileTransaction,
  BitcoinFileTransaction: BitcoinFileTransaction,
  BitcoinInput: BitcoinInput,
  EtherContractTransaction: EtherContractTransaction
};