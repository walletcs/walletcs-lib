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
  input.satoshi = outx.satoshi;
  input.outputIndex = outx.outputIndex;
  input.script = new bitcoincore.Script(outx.address).toHex();

  return input;
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

  __getTx() {
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
    return JSON.stringify(this.__getTx())
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

  setNonce(nonce) {
    this.transaction.nonce = nonce
  }

  calculateGasPrice() {
    this.provider.getGasPrice().then(function (gasPrice) {
      this.transaction.gasPrice = gasPrice;
    })
  }

  calculateGasLimit() {
    this.provider.estimateGas(this.transaction).then(function (gasLimit) {
      this.tranasction.gasLimit = gasLimit
    })
  }

  getResult() {
    return this.transaction;
  }

}

class BitcoinTxBuilder extends transactions.BitcoinTxBuilderInterfce {
  constructor(network){
    super(network);
    this.transaction = new BitcoinTx();
  }

  setFromAddress(address){
    this.transaction.from.push(address);
  }

  setToAddress(address){
    this.transaction.to.push(address);
  }

  setAmount(amount){
    this.transaction.amounts.push(amount);
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
    const addresses = _.zipWith([this.transaction.to, this.transaction.amounts],
      function (to, amount) {
        return {'to': to, 'satoshi': amount};
    });
    tx.to(addresses);
    tx.from(this.transaction.inputs);
    tx.change(this.transaction.changeAddress);
    this.transaction.fee = tx.getFee()
  }

}

module.exports = {
  EtherTx,
  BitcoinTx,
  EtherTxBuilder,
};