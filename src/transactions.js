require('babel-polyfill');
require("@babel/register");

const transactions = require('./base/transactions');
const structures = require('./base/structures');
const errors = require('./base/errors');
const _ = require('lodash');
const ethers = require('ethers');
const bitcore = require('bitcore-lib');
const abidecoder = require('abi-decoder');

function convetOutxToInput(outx) {
  const input = JSON.parse(JSON.stringify(structures.BitcoinInput));
  input.address = outx.address;
  input.txId = outx.txId;
  input.satoshis = outx.satoshis;
  input.outputIndex = outx.outputIndex;
  input.script = new bitcore.Script(bitcore.Address(outx.address)).toHex();

  return input;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function convertToSatoshi (val) {
  if (isFloat(val)){
    return parseInt(parseFloat(val)*Math.pow(10, 8))
  }
  return val
}

class EtherTx extends transactions.EtherUnsignedTxInterface {
  constructor() {
    super();
    this.to = '';
    this.value = 0;
    this.gasPrice = ethers.utils.bigNumberify(0);
    this.gasLimit = ethers.utils.bigNumberify(0);
    this.data = '0x';
    this.nonce = 0;
  }

  isCompleted(){
    return this.to && this.value && ethers.utils.bigNumberify(this.gasLimit) && ethers.utils.bigNumberify(this.gasPrice)
  }

  __getTX() {
    if (!this.isCompleted()) return null;

    return {
      to: this.to,
      value: this.value,
      gasPrice: this.gasPrice.toNumber(),
      gasLimit: this.gasLimit.toNumber(),
      data: this.data,
      nonce: this.nonce
    }
  }

  toJSON() {
    if (!this.isCompleted()) throw Error(errors.BUILD_TX_ERROR);
    return JSON.stringify(this.__getTX())
  }

  getTx() {
    return this.__getTX();
  }
}

class EtherContractTx extends EtherTx {
  constructor() {
    super();
    this.methodName = null;
    this.methodParams = [];
  }

  isCompleted(){
    return this.to && this.value && ethers.utils.bigNumberify(this.gasLimit) && ethers.utils.bigNumberify(this.gasPrice) && this.data !== '0x';
  }


  __getTX() {
    if (!this.isCompleted()) return null;
    return {
      to: this.to,
      gasPrice: this.gasPrice.toNumber(),
      gasLimit: this.gasLimit.toNumber(),
      data: this.data,
      nonce: this.nonce,
    }
  }

}

class BitcoinTx extends transactions.BitcoinUnsignedTxInterface {
  constructor() {
    super();
    this.to = [];
    this.from = [];
    this.amounts = [];
    this.inputs = [];
    this.change = 0;
    this.fee = 0;
    this.changeAddress = '';
    this.threshold = 0;
  }

  isCompleted(){
    return this.to.length && this.from.length && this.amounts.length && this.inputs.length && this.fee && this.changeAddress;
  }

  __getTX() {
    if (!this.isCompleted()) return null;
    return {
      to: this.to,
      from: this.from,
      amounts: this.amounts,
      inputs: this.inputs,
      change: this.change,
      fee: this.fee,
      changeAddress: this.changeAddress,
      threshold: this.threshold
    }
  }

  toJSON() {
    if (!this.isCompleted()) throw Error(errors.BUILD_TX_ERROR);
    return JSON.stringify(this.__getTX())
  }

  getTx() {
    return this.__getTX();
  }
}

class EtherTxBuilder extends transactions.EtherTxBuilderInterface {
  constructor(){
    super();
    this.transaction = new EtherTx()
  }

  setToAddress(address) {
    this.transaction.to = address;
  }

  setAmount(amount) {
    this.transaction.value =  ethers.utils.parseEther(amount.toString() || '0');
  }

  setNonce(nonce) {
    this.transaction.nonce = parseInt(nonce || 0);

  }

  setGasPrice(gas) {
   this.transaction.gasPrice = ethers.utils.bigNumberify(gas || 1000000000);
  }

  setGasLimit(gas) {
    this.transaction.gasLimit = ethers.utils.bigNumberify(gas || 21000);
  }

  getResult() {
    return this.transaction;
  }

}

class BitcoinTxBuilder extends transactions.BitcoinTxBuilderInterfce {
  constructor(){
    super();
    this.transaction = new BitcoinTx();
  }

  setFromAddress(address){
    if(_.isArray(address)){
      this.transaction.from = _.concat(this.transaction.from, address)
    }
    else{
      this.transaction.from.push(address);
    }
  }

  setThreshold(threshold){
    this.transaction.threshold = threshold;
  }

  setToAddress(address){
    if(_.isArray(address)){
      this.transaction.to = _.concat(this.transaction.to, address)
    }
    else{
      this.transaction.to.push(address);
    }
  }

  // setAmount(amount){
  //   if(_.isArray(amount)){
  //     this.transaction.amounts = _.concat(this.transaction.amounts, amount)
  //   }else{
  //     this.transaction.amounts.push(amount);
  //   }
  //   this.transaction.amounts = _.map(this.transaction.amounts, function (val) {
  //     if(isFloat(val)) {
  //       return convertToSatoshi(val);
  //     }
  //     return val
  //   })
  // }

  addOutx(outx){
    const input = convetOutxToInput(outx);
    this.transaction.inputs.push(input);
  }

  setChangeAddress(address){
    this.transaction.changeAddress = address;
  }

  calculateFee(fee){
    if (!fee && this.transaction.to.length && this.transaction.amounts.length) {
      try {
        const tx = new bitcore.Transaction();
        tx.to(_.map(this.transaction.to,
          function (val) {
            return {'address': val.address, 'satoshis': val.amount};
          }));
        tx.from(this.transaction.inputs);
        tx.change(this.transaction.changeAddress);
        this.transaction.fee = tx.getFee();
      }catch (e) {
        console.log('Warning fee calculation: ', e);
      }
    }
    if (fee) {
      this.transaction.fee = convertToSatoshi(fee)
    }
  }

  getResult() {
    return this.transaction.__getTX();
  }

}

class EtherContractTxBuilder extends transactions.EtherContractTxBuilderInterface {
  constructor(){
    super();
    this.transaction = new EtherContractTx();
  }

  setMethodName(name) {
    this.transaction.nameMethod = name;
  }

  setMethodParams(params){
    this.transaction.methodParams = params;
  }

  setToAddress(address) {
    this.transaction.to = address;
  }

  setNonce(nonce) {
    this.transaction.nonce = parseInt(nonce || 0);

  }

  setGasPrice(gas) {
   this.transaction.gasPrice = ethers.utils.bigNumberify(gas || 1000000000);
  }

  setGasLimit(gas) {
    this.transaction.gasLimit = ethers.utils.bigNumberify(gas || 21000);
  }

  getResult() {
    return this.transaction;
  }

  setData(data) {
    this.transaction.data = data;
  }
}

class TransactionConstructor {
  constructor(builder){
    this.builder = builder;
  }

  buildBitcoinTx(outxs, from, to, amounts, changeAddress, fee){
    this.builder.setFromAddress(from);
    this.builder.setToAddress(to);
    this.builder.setAmount(amounts);
    const self = this;
    if (_.isArray(outxs)){
      _.each(outxs, function (outx) {
        self.builder.addOutx(outx);
      })
    }
    else{
      this.builder.addOutx(outxs);
    }
    this.builder.setChangeAddress(changeAddress);
    this.builder.calculateFee(fee);
    return this.builder.getResult()
  }

  buildEtherTx(transaction){
    this.builder.setToAddress(transaction.to);
    this.builder.setAmount(transaction.value);
    this.builder.setNonce(transaction.nonce);
    this.builder.setGasPrice(transaction.gasPrice);
    this.builder.setGasLimit(transaction.gasLimit);
    return this.builder.getResult();
  }

  buildEtherContractTx(transaction, abi){
    abidecoder.addABI(abi);
    const methodData = abidecoder.decodeMethod(transaction.data);
    this.builder.setToAddress(transaction.to);
    this.builder.setNonce(transaction.nonce);
    this.builder.setGasPrice(transaction.gasPrice);
    this.builder.setGasLimit(transaction.gasLimit);
    this.builder.setData(transaction.data);
    this.builder.setMethodName(methodData ? methodData.name : null);
    this.builder.setMethodParams(methodData ? methodData.params : []);
    return this.builder.getResult();
  }

  buildBitcoinMultiSignTx(outxs, from, to, amounts, changeAddress, fee, threshold){
    this.builder.setFromAddress(from);
    this.builder.setToAddress(to);
    this.builder.setAmount(amounts);
    this.builder.setThreshold(threshold);
    const self = this;
    if (_.isArray(outxs)){
      _.each(outxs, function (outx) {
        self.builder.addOutx(outx);
      })
    }
    else{
      this.builder.addOutx(outxs);
    }
    this.builder.setChangeAddress(changeAddress);
    this.builder.calculateFee(fee);
    return this.builder.getResult()
  }
}


module.exports = {
  EtherTx,
  BitcoinTx,
  EtherContractTx,
  EtherTxBuilder,
  BitcoinTxBuilder,
  EtherContractTxBuilder,
  TransactionConstructor,
};