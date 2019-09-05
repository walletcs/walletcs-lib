require('babel-polyfill');
const transactions = require('./base/transactions');
const ethers = require('ethers');

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
  constructor(){
    super();
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
  }

  getResult() {

  }

}

module.exports = {
  EtherTx,
  BitcoinTx
};