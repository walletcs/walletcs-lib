require('babel-polyfill');
const transactions = require('./base/transactions');
const structures = require('./base/structures');
const _ = require('lodash');
const ethers = require('ethers');
const bitcoincore = require('bitcore-lib');

function convetOutxToInput(outx) {
  const input = JSON.parse(JSON.stringify(structures.BitcoinInput));
  input.address = outx.address;
  input.txId = outx.txId;
  input.satoshis = outx.satoshis;
  input.outputIndex = outx.outputIndex;
  input.script = new bitcoincore.Script(bitcoincore.Address(outx.address)).toHex();

  return input;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function convertToSatoshi (val) {
  return parseInt(parseFloat(val)*Math.pow(10, 8))
}

class EtherTx extends transactions.EtherUnsignedTxInterface {
  constructor() {
    super();
    this.to = '';
    this.from = '';
    this.value = 0;
    this.gasPrice = 0;
    this.gasLimit = 0;
    this.data = '0x';
    this.nonce = 0;
  }

  __getTX() {
    return {
      to: this.to,
      from: this.from,
      value: this.value,
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
      data: this.data,
      nonce: this.nonce
    }
  }

  toJSON() {
    return JSON.stringify(this.__getTX())
  }
}

class EtherContractTx extends EtherTx {
  constructor() {
    super();
    this.abi = {};
  }

  __getTX() {
    let tx = super.__getTX();
    tx.abi = this.abi;
    return tx
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
  }

  __getTX() {
    return {
      to: this.to,
      from: this.from,
      amounts: this.amounts,
      inputs: this.inputs,
      change: this.change,
      fee: this.fee,
      changeAddress: this.changeAddress
    }
  }

  toJSON() {
    return JSON.stringify(this.__getTX())
  }
}

class EtherTxBuilder extends transactions.EtherTxBuilderInterface {
  constructor(network){
    super(network);
    this.provider = ethers.getDefaultProvider(this.network);
    this.transaction = new EtherTx()
  }

  setFromAddress(address) {
    this.transaction.from = address;
  }

  setToAddress(address) {
    this.transaction.to = address;
  }

  setAmount(amount) {
    this.transaction.value = amount;
  }

  async setNonce(nonce) {
    if(!nonce){
      this.transaction.nonce = await this.provider.getTransactionCount(this.transaction.from)
    }else {
      this.transaction.nonce = nonce
    }
  }

  async calculateGasPrice() {
   this.transaction.gasPrice = ethers.utils.bigNumberify(await this.provider.getGasPrice());
  }

  async calculateGasLimit() {
    this.transaction.gasLimit = ethers.utils.bigNumberify(await this.provider.estimateGas(this.transaction));
  }

  getResult() {
    return this.transaction.__getTX();
  }

}

class BitcoinTxBuilder extends transactions.BitcoinTxBuilderInterfce {
  constructor(network){
    super(network);
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

  setToAddress(address){
    if(_.isArray(address)){
      this.transaction.to = _.concat(this.transaction.to, address)
    }
    else{
      this.transaction.to.push(address);
    }
  }

  setAmount(amount){
    if(_.isArray(amount)){
      this.transaction.amounts = _.concat(this.transaction.amounts, amount)
    }else{
      this.transaction.amounts.push(amount);
    }
    this.transaction.amounts = _.map(this.transaction.amounts, function (val) {
      if(isFloat(val)) {
        return convertToSatoshi(val);
      }
      return val
    })
  }

  addOutx(outx){
    const input = convetOutxToInput(outx);
    this.transaction.inputs.push(input);
  }

  addChangeAddress(address){
    this.transaction.changeAddress = address;
  }

  calculateFee(){
    const tx = new bitcoincore.Transaction();
    const addresses = _.zipWith(this.transaction.to, this.transaction.amounts,
      function (to, amount) {
        return {'address': to, 'satoshis': amount};
    });
    console.log(addresses);
    tx.from(this.transaction.inputs);
    tx.change(this.transaction.changeAddress);
    this.transaction.fee = tx.getFee()
  }

  getResult() {
    return this.transaction.__getTX();
  }

}

class EtherContractTxBuilder extends EtherTxBuilder {
  constructor(network){
    super(network);
    this.transaction = new EtherContractTx();
  }

  setFromAddress(address) {
    throw Error('This method dosen\'t use in contract transaction.')
  }

  setAbi(abi) {
    this.transaction.abi = abi;
  }

  setData(data){
    this.transaction.data = data;
  }
}

module.exports = {
  EtherTx,
  BitcoinTx,
  EtherTxBuilder,
  BitcoinTxBuilder,
  EtherContractTxBuilder,
};