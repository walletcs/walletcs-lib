import { ethers } from 'ethers';
import Papa from 'papaparse';

const GAS_LIMIT = 21000;

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
