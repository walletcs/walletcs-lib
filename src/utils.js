import { ethers } from 'ethers';
import Papa from 'papaparse';

export const shallowCopy = (object) => {
  const result = {};
  for (const key in object) { result[key] = object[key]; }
  return result;
};

export class ConverterCSVToTxObject {
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
      for (let i = 0; i < result.data.length; i += 1){
        let tx = {};
        tx['nonce'] = nonce + i;
        let row = result.data[i];
        if (row[0]){
          tx['to'] = row[0];
          tx['value'] = row[1];
          tx['from'] = this._publicKey;
          paramsArray.push(tx)
        }
        tx['gasLimit'] = 21000;
        const tx_copy = shallowCopy(tx);
        tx_copy.value = ethers.utils.parseEther(tx_copy.value);
        let bigNumberGasPrice = await provider.estimateGas(tx_copy);
        tx['gasPrice'] = bigNumberGasPrice.toNumber();
      }
      return paramsArray;
    }
    return null;
  }
}
