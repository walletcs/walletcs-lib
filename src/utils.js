import { ethers } from 'ethers';
import Papa from 'papaparse';

const GAS_LIMIT = 21000;

export const shallowCopy = (object) => {
  const result = {};
  for (const key in object) { result[key] = object[key]; }
  return result;
};

export class ConverterEtherCSVToTxObject {
  constructor(file, publicKey, network){
    this._csvFile = file;
    this._publicKey = publicKey;
    this._network = network;
  }
  
  async convert () {
    if (this._csvFile && this._publicKey){
      let provider = ethers.getDefaultProvider(this._network);
      let nonce = await provider.getTransactionCount(this._publicKey);
      let result = Papa.parse(this._csvFile);
      let paramsArray = [];
      for (let i = 1; i < result.data.length; i += 1){
        let tx = {};
        tx['nonce'] = nonce + i - 1;
        let row = result.data[i];
        if (row[0]){
          tx['to'] = row[0];
          tx['value'] = row[1];
          tx['from'] = this._publicKey;
          const gasPrice = await provider.getGasPrice();
          tx['gasPrice'] = gasPrice.toNumber();
          const tx_copy = shallowCopy(tx);
          tx_copy.value = ethers.utils.parseEther(tx_copy.value);
          const gasLimit = await provider.estimateGas(tx_copy);
          try {
            tx['gasLimit'] = gasLimit.toNumber();
          } catch (e) {
            tx['gasLimit'] = GAS_LIMIT;
          }
        
          paramsArray.push(tx)
        }
      }
      return paramsArray;
    }
    return null;
  }
}


export class ConverterBitcoinCSVToTxObject {
  constructor(file){
    this._csvFile = file;
  }

  async convert () {
    if (this._csvFile){
      let result = Papa.parse(this._csvFile);
      let params = {'from_addresses': [], 'to_addresses': [], 'amounts': [], 'change_address': null};
      for (let i = 1; i < result.data.length; i += 1){
        let row = result.data[i];
        if (row[1] === 'from'){
          params.from_addresses.push(row[0]);
        }
        if (row[1] === 'to'){
          params.to_addresses.push(row[0]);
          params.amounts.push(row[2])
        }
        if (row[3] === 'true') {
          params.change_address = row[0]
        }
      }
      return params;
    }
    return null;
  }
}