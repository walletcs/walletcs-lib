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
    this.from = '';
    this.value = 0;
    this.gasPrice = ethers.utils.bigNumberify(0);
    this.gasLimit = ethers.utils.bigNumberify(0);
    this.data = '0x';
    this.nonce = 0;
  }

  isCompleted(){
    return this.to &&
        this.value &&
        this.nonce !== undefined &&
        ethers.utils.bigNumberify(this.gasLimit) &&
        ethers.utils.bigNumberify(this.gasPrice)
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
    return this.to &&
        this.value &&
        this.nonce !== undefined &&
        ethers.utils.bigNumberify(this.gasLimit) &&
        ethers.utils.bigNumberify(this.gasPrice) &&
        this.data !== '0x';
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
    this.inputs = [];
    this.change = 0;
    this.fee = 0;
    this.changeAddress = '';
    this.threshold = 0;
  }

  isCompleted(){
    return !!this.to.length &&
      !!this.from.length &&
      !!this.inputs.length &&
      !!this.fee
  }

  __getTX() {
    if (!this.isCompleted()) return null;
    return {
      to: this.to,
      from: this.from,
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
  
  setFromAddress(from){
    if (_.isArray(from)){
      const item = from.pop();
      if (item) {
        this.transaction.from = item.address;
      }
    }else{
      this.transaction.from = from.address;
    }
   return this;
  }

  setToAddress(to) {
    if (_.isArray(to)){
      const item = to.pop();
      if (item) {
        this.transaction.to = item.address;
        this.setAmount(item.amount);
      }
    }else{
      this.transaction.to = to.address;
      this.setAmount(to.amount);
    }
    return this;
  }

  setFromAddress(address){
    this.transaction.from = address;
  }

  setAmount(amount) {
    this.transaction.value =  ethers.utils.parseEther(amount.toString() || '0');
    return this;
  }

  setNonce(nonce) {
    this.transaction.nonce = parseInt(nonce || 0);
    return this;
  }

  setGasPrice(gas) {
   this.transaction.gasPrice = ethers.utils.bigNumberify(gas || 1000000000);
    return this;
  }

  setGasLimit(gas) {
    this.transaction.gasLimit = ethers.utils.bigNumberify(gas || 21000);
    return this;
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

  setFromAddress(from){
    const self = this;
    if(_.isArray(from)){
      const _from = _.map(from, function (item) {
        if (item.change) self.setChangeAddress(item.address);
        return item.address
      });
      _.each(_from, value => {
        if(value) this.transaction.from.push(value)
      })
    }
    else{
      if (from.change) self.setChangeAddress(from.address);
      this.transaction.from.push(from.address);
    }
    this.transaction.from = _.uniq(this.transaction.from);

    return this;
  }

  setThreshold(threshold){
    this.transaction.threshold = threshold;
    return this;
  }

  setToAddress(to){
    if(_.isArray(to)){
      this.transaction.to = _.concat(this.transaction.to, _.map(to, function (item) {
        return {address: item.address, satoshis: convertToSatoshi(item.amount)}
      }))
    }
    else{
      this.transaction.to.push({address: to.address, satoshis: convertToSatoshi(to.amount)});
    }
    return this;
  
  }

  addOutx(outx){
    const input = convetOutxToInput(outx);
    this.transaction.inputs.push(input);
    return this;
  }

  setChangeAddress(address){
    this.transaction.changeAddress = address;
    return this;
  }

  calculateFee(fee){
    if (!fee && !!this.transaction.to.length) {
      try {
        const tx = new bitcore.Transaction();
        tx.to(this.transaction.to);
        tx.from(this.transaction.inputs);
        this.transaction.fee = tx.getFee();
      }catch (e) {
        console.log('Warning fee calculation: ', e);
      }
    }
    if (fee) {
      this.transaction.fee = convertToSatoshi(fee)
    }
    return this;
  }

  getResult() {
    return this.transaction.__getTX();
  }

}

class EtherContractTxBuilder extends transactions.EtherContractTxBuilderInterface {
  constructor(){
    super();
    this.transaction = new EtherContractTx();
    return this;
  }

  setFromAddress(address){
    this.transaction.from = address;
  }

  setMethodName(name) {
    this.transaction.nameMethod = name;
    return this;
  }

  setMethodParams(params){
    this.transaction.methodParams = params;
    return this;
  }
  
  setFromAddress(from){
    if (_.isArray(from)){
      const item = from.pop();
      if (item) {
        this.transaction.from = from.address;
      }
    }
    return this
  }
  
  setToAddress(to) {
    if (_.isArray(to)){
      const item = to.pop();
      if (item) {
        this.transaction.to = item.address;
      }
    }else{
      this.transaction.to = to.address;
    }
    return this;
  }

  setNonce(nonce) {
    this.transaction.nonce = parseInt(nonce || 0);
    return this;

  }

  setGasPrice(gas) {
   this.transaction.gasPrice = ethers.utils.bigNumberify(gas || 1000000000);
    return this;
  }

  setGasLimit(gas) {
    this.transaction.gasLimit = ethers.utils.bigNumberify(gas || 21000);
    return this;
  }
  
  setData(data) {
    this.transaction.data = data;
    return this;
  }

  getResult() {
    return this.transaction;
  }
}

class TransactionConstructor {
  constructor(builder){
    this.builder = builder;
  }

  buildBitcoinTx(outxs, from, to,  fee){
    this.builder.setFromAddress(from);
    this.builder.setToAddress(to);
    const self = this;
    if (_.isArray(outxs)){
      _.each(outxs, function (outx) {
        self.builder.addOutx(outx);
      })
    }
    else{
      this.builder.addOutx(outxs);
    }
    this.builder.calculateFee(fee);
    return this.builder.getResult()
  }

  buildEtherTx(transaction){
    this.builder.setToAddress(transaction.to);
    this.builder.setFromAddress(transaction.from);
    this.builder.setNonce(transaction.nonce);
    this.builder.setGasPrice(transaction.gasPrice);
    this.builder.setGasLimit(transaction.gasLimit);
    return this.builder.getResult();
  }

  buildEtherContractTx(transaction, abi){
    abidecoder.addABI(abi);
    const methodData = abidecoder.decodeMethod(transaction.data);
    this.builder.setToAddress(transaction.to);
    this.builder.setFromAddress(transaction.from);
    this.builder.setNonce(transaction.nonce);
    this.builder.setGasPrice(transaction.gasPrice);
    this.builder.setGasLimit(transaction.gasLimit);
    this.builder.setData(transaction.data);
    this.builder.setMethodName(methodData ? methodData.name : null);
    this.builder.setMethodParams(methodData ? methodData.params : []);
    return this.builder.getResult();
  }

  buildBitcoinMultiSignTx(outxs, from, to, changeAddress, fee, threshold){
    this.builder.setFromAddress(from);
    this.builder.setToAddress(to);
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
