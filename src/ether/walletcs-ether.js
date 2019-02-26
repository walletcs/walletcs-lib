import 'babel-polyfill';
import {EtherTransactionDecoder} from '../ether/transactions';
import {utils} from 'ethers';

export class FileTransactionGenerator {
  constructor() {
    this.tx = [];
    this.contracts = []
  }

  addContract(address, abi){
    this.contracts.push({'contract': address, 'abi': abi})
  }

  addTx(publicKey, tx){
    this.tx.push({'pub_key': publicKey, 'transaction': tx})
  }
  
  deleteTx(index){
    this.tx.splice(index, 1)
  }
  
  deleteContract(index){
    this.contracts.splice(index, 1)
  }

  generateJson(){
    let obj = {};

    if(this.tx.length !== 0){
      obj['transactions'] = this.tx
    }

    if(this.contracts.length !== 0){
      obj['contracts'] = this.contracts
    }

    return JSON.stringify(obj)
  }

}

export class FileTransactionReader {
  constructor(file) {
    this._file = file;
    this._transactions = [];
    this._contracts = [];
  }
  
  get transactions(){
    return this._transactions
  }
  
  get contracts(){
    return this._contracts
  }
  
  parserFile() {
    let json = JSON.parse(this._file);
    
    if(json.transactions === undefined || !Array.isArray(json.transactions) || json.transactions.length === 0 ||
        json.contracts === undefined || !Array.isArray(json.contracts) || json.contracts.length === 0){
      throw 'File format is not correct'
    }
    //Set all contracts
    this._contracts = json.contracts;
    // Decode all transaction from file
    let transactions = json.transactions;
    for(let key in transactions){
      let objTx = transactions[key];
      let tx = new EtherTransactionDecoder(objTx.transaction);
      tx.decode();
      tx.addABI(this.contracts.map(function (obj) {if(obj.contract === tx.result.to) return obj.abi})[0]);
      this._transactions.push({pub_key: objTx.pub_key, transaction: tx.getTransaction()})
    }
  }
}

export function checkAddress(key) {
    if(!key){
      return false
    }

    return key.length === 42 && key.startsWith('0x');
  }

export function checkPrivateKey(key) {
  try {
    let w = new utils.SigningKey(key);
  }catch (e) {
    return false
  }
  return true
  }
