/*
* Simple wrapper for create, parse and sign "ethereum" transactions.
*/
import 'babel-polyfill';
import {ethers, utils, Wallet} from 'ethers';
import { abi } from 'web3';
import { addABI, decodeMethod} from 'abi-decoder';

function isTokenTx(data){
  console.log(data, '0x' === data);
  return !('0x' === data);
}


class EtherTransactionDecoder {
  // signed tx -> object tx
  constructor(rawTx){
    this.tx = rawTx;
    this.abi = undefined;
  }

  decodeTx() {
    let result = this._decode();
    result['gasLimit'] = result.gasLimit.toNumber();
    result['gasPrice'] = result.gasPrice.toNumber();

    if(isTokenTx(result['data'])){
      result['data'] = EtherTransactionDecoder.decodeMethodContract(result['data']);
    }

    console.log(result);
    return result
  }

  addABI(abi){
    addABI(abi)
  }

  _decode() {
    return utils.parseTransaction(this.tx);
  }

  static decodeMethodContract(hexMethod) {
    return decodeMethod(hexMethod);
  }

  async verifySiganture(message, publicK){
    // Promise
    return await utils.verifyMessage(message, this.tx);
  }


}

class EtherTransaction{
  // object tx -> signed tx
  async sign(privateKey, rawTx){
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

    if(!isTokenTx(rawTx)){
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

class EtherKeyPair {
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

module.exports = {
  EtherTransactionDecoder: EtherTransactionDecoder,
  EtherKeyPair: EtherKeyPair,
  EtherTransaction: EtherTransaction
};