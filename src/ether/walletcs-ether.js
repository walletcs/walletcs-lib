import 'babel-polyfill';
import {EtherTransactionDecoder} from 'walletcs';
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
    let json = JSON.parse(this.file);
    
    if(json['transactions'] === undefined || !json['transactions'].isArray() || json['contracts'] === undefined || !json['contracts'].isArray()){
      throw 'File format is not correct'
    }
    // Decoder all transaction from file
    let transactions = json.transactions;
    for(let key in transactions){
      let objTx = transactions[key];
      let tx =EtherTransactionDecoder(objTx['transaction']).decodeTx();
      this._transactions.push({pub_key: objTx['pub_key'], transaction: tx})
    }
    
    //Set all contracts
    this._contracts = json.contracts;
  
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
