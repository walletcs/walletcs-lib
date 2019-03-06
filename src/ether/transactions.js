/*
* Simple wrapper for create, parse and sign "ethereum" transactions.
*/
import 'babel-polyfill';
import {ethers, utils, Wallet} from 'ethers';
import { abi } from 'web3';
import { addABI, decodeMethod} from 'abi-decoder';

'use strict';

function isTokenTx(data){
  return !('0x' === data);
}


export class EtherTransactionDecoder {
  // signed tx -> object tx
  constructor(rawTx){
    this.tx = rawTx;
    this.abi = undefined;
  }

  getTransaction() {
    this.result.gasLimit = this.result.gasLimit.toNumber();
    this.result.gasPrice = this.result.gasPrice.toNumber();
    {this.result.value ? this.result.value = this.result.value.toNumber() : undefined}
    
    if(isTokenTx(this.result['data'])){
      this.result['data'] = EtherTransactionDecoder.decodeMethodContract(this.result['data']);
    }

    return this.result
  }

  static addABI(abi){
    addABI(abi)
  }
  decode() {
    this.result = utils.parseTransaction(this.tx);
  }

  static decodeMethodContract(hexMethod) {
    return decodeMethod(hexMethod);
  }

  async verifySiganture(message, publicK){
    // Promise
    return await utils.verifyMessage(message, this.tx);
  }


}

export class EtherTransaction{
  // object tx -> signed tx
  async static sign(privateKey, rawTx){
    // Promise
    let _wallet = new Wallet(privateKey);

    return await _wallet.sign(rawTx);
  }

  static checkCorrectTx(rawTx){
    let mainRequirements = ['gasLimit', 'gasPrice', 'data', 'to'];
    let etherRequiremets = ['value', 'from'];

    for(let key in mainRequirements){
      if(!(mainRequirements[key] in rawTx)){
        return false
      }
    }

    if(!isTokenTx(rawTx['data'])){
      for(let key in etherRequiremets){
        if(!(etherRequiremets[key] in rawTx)){
          return false
        }
      }
    }else{
      if(!('to' in rawTx)) return false;
    }

    return true
  }
}

export class EtherKeyPair {
  // Create and manipulate with private and public key
  static generatePair(){
    let keyPair = {};
    let _wallet = Wallet.createRandom();
    keyPair['address'] = _wallet.address;
    keyPair['privateKey'] = _wallet.privateKey;
    return keyPair
  }

  static recoveryPublicKey(privateKey){
    let pk = new ethers.utils.SigningKey(privateKey);
    let w = new Wallet(pk);
    return w.address
  }

  static checkPair(pubK, privateK){
    return pubK === EtherKeyPair.recoveryPublicKey(privateK)
  }
}
