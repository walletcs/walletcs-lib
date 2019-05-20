import 'babel-polyfill';
import {EtherTransactionDecoder} from './index';
import {utils} from 'ethers';
import { Transaction, address} from 'bitcoinjs-lib'

export class FileTransactionGenerator {
  constructor(publicKey) {
    this.tx = [];
    this.contracts = [];
    this._publicKey = publicKey;
  }

  addContract(address, abi){
    this.contracts.push({'contract': address, 'abi': abi})
  }

  addTx(contract, tx, network){
    this.tx.push({'contract': contract, 'transaction': tx, network: network})
  }

  deleteTx(index){
    this.tx.splice(index, 1)
  }

  deleteContract(index){
    this.contracts.splice(index, 1)
  }

  getAbi(contractAddress){
    // Only for ether contract transactions
    for(let key in this.contracts){
      if(contractAddress === this.contracts[key].contract){
        return this.contracts[key].abi
      }
    }
  }

  generateJson(){
    let obj = {};
    obj['pub_key'] = this._publicKey;

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

  _parserEtherFile() {
    let json = JSON.parse(this._file);

    if(json.transactions === undefined || !Array.isArray(json.transactions) || json.transactions.length === 0){
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

      if (tx.data !== '0x') {
        EtherTransactionDecoder.addABI(this.contracts.map(function (obj) {if(obj.contract === tx.result.to) return obj.abi})[0]);
      }
      this._transactions.push({contract: objTx.contract, transaction: tx.getTransaction()})
    }
  }

  _parserBitcoinFile(){
    let json = JSON.parse(this._file);

    if(json.transactions === undefined || !Array.isArray(json.transactions) || json.transactions.length === 0){
      throw 'File format is not correct'
    }
    // Decode all transaction from file
    let transactions = json.transactions;
    for(let key in transactions){

      let objTx = transactions[key];
      let tx = Transaction.fromHex(objTx.transaction);

      let params = [];
      tx.outs.forEach((out) => {
        try {
          params.push({value: out.value, to: address.fromOutputScript(out.script)})
        } catch (e) {
          console.log(e)
        }
      });
      this._transactions.push({contract: null, transaction: tx, params: params})
    }
  }
  // bitcoin boolean
  parserFile(bitcoin, transfer) {
    if(!bitcoin) this._parserEtherFile();
    if(bitcoin) this._parserBitcoinFile()
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
