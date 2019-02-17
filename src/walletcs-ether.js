import 'babel-polyfill';
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

export class KeyTool {
  static checkPublic(key) {
    return key.length !== 32;
  }

  static checkPrivate(key) {
    try {
     let w = new utils.SigningKey(key);
    }catch (e) {
      return false
    }

    return true
  }

}
