/*
* Simple wrapper for create, parse and sign "ethereum" transactions.
*/
import 'babel-polyfill';
import {ethers, utils, Wallet} from 'ethers';
import { abi } from 'web3';
import { addABI, decodeMethod} from 'abi-decoder';
import * as bip39 from "bip39";
import * as bip32 from "bip32";

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
    {this.result.value ? this.result.value = utils.formatEther(this.result.value) : 0}
    
    if(isTokenTx(this.result['data'])){
      this.result['data'] = EtherTransactionDecoder.decodeMethodContract(this.result['data']);
    }

    return this.result
  }

  addABI(abi){
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

  static createTx(publicKey, contractAddress, methodParams, abi, methodName){
    // Normalization for transaction params
    if (methodParams.find(val => val.name === 'from')) {
      return this._normalizeTransferTransaction(methodParams);
    }
    return this._normalizeContractTransaction(publicKey, contractAddress, methodParams, abi, methodName);
  };

  static _normalizeContractTransaction(publicKey, addressCon, methodParams, abi, methodName) {
    const defaultValues = ['gasPrice', 'gasLimit', 'nonce'];
  
    const newTx = {};
    const newParams = [];
    const inter = new ethers.utils.Interface(abi);
  
    for (let i = 0; i < methodParams.length; i++) {
      const l = methodParams[i];
      if (defaultValues.includes(l.name)) {
        newTx[l.name] = l.name === 'gasPrice' ? ethers.utils.bigNumberify(l.value) : l.value;
      } else if (inter.functions[methodName].payable && l.name === 'value') {
        newTx[l.name] = utils.parseEther(l.value);
      } else {
        newParams.push(l.value);
      }
    }
  
    let txData;
  
    try {
      txData = inter.functions[methodName].encode(newParams);
    } catch (e) {
      console.log(e, methodName);
    }
  
    newTx.data = txData;
    newTx.to = addressCon;
  
    return newTx;
  };
  
  
  static _normalizeTransferTransaction(methodParams) {
    const newTx = {};
  
    for (let i = 0; i < methodParams.length; i++) {
      const l = methodParams[i];
      if (l.name === 'from') continue;
      if (l.name === 'value') {
        newTx[l.name] = utils.parseEther(l.value);
      } else if (l.name === 'gasPrice') {
        newTx[l.name] = ethers.utils.bigNumberify(l.value);
      } else if (l.name === 'nonce') {
        newTx[l.name] = parseInt(l.value);
      } else {
        newTx[l.name] = l.value;
      }
    }
    newTx.data = '0x';
    return newTx;
  };
  // object tx -> signed tx
  static async sign(privateKey, rawTx){
    // Promise
    rawTx.gasPrice = utils.bigNumberify(rawTx.gasPrice);
    if (rawTx.value) {
      rawTx.value = utils.bigNumberify(rawTx.value);
    }
    let _wallet = new Wallet(privateKey);

    return await _wallet.sign(rawTx);
  }

  static checkCorrectTx(rawTx){
    let mainRequirements = ['gasLimit', 'gasPrice', 'data', 'to'];
    let etherRequirements = ['value'];

    for(let key in mainRequirements){
      if(!(mainRequirements[key] in rawTx)){
        return false
      }
    }

    if(!isTokenTx(rawTx['data'])){
      for(let key in etherRequirements){
        if(!(etherRequirements[key] in rawTx)){
          return false
        }
      }
    }else{
      if(!('to' in rawTx)) return false;
    }

    return true
  }
}

export class EtherWallet {
  // Create and manipulate with private and public key
  static generatePair(){
    let _wallet = Wallet.createRandom();
    return [_wallet.address, _wallet.privateKey]
  }

  static recoveryPublicKey(privateKey){
    let pk = new ethers.utils.SigningKey(privateKey);
    let w = new Wallet(pk);
    return w.address
  }

  static checkPair(pubK, privateK){
    return pubK === EtherWallet.recoveryPublicKey(privateK)
  }

  static fromMnemonic (mnemonic) {
    ethers.utils.HDNode.isValidMnemonic(mnemonic);
    const node = ethers.utils.HDNode.fromMnemonic(mnemonic);
    return [node.neuter().extendedKey, node.extendedKey]
  }

  static generateMnemonic() {
    return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16))
  }

  static validateMnemonic(mnemonic) {
    return ethers.utils.HDNode.isValidMnemonic(mnemonic);
  }

  static getAddressWithPrivateFromXprv(xprv, number_address) {
    const root = ethers.utils.HDNode.fromExtendedKey(xprv);
    const standardEthereum = root.derivePath(`0/${number_address || 0}`);
    return [standardEthereum.address, standardEthereum.privateKey]
  };

  static getAddressFromXpub(xpub, number_address) {
    const root = ethers.utils.HDNode.fromExtendedKey(xpub);
    const standardEthereum = root.derivePath(`0/${number_address || 0}`);
    return standardEthereum.address
  }
}

export const representEthTx = (tx) => {
  let newTx = JSON.parse(JSON.stringify(tx));
  if (tx.value) {
    newTx.value = utils.formatEther(tx.value);
  }
  return newTx;
};
