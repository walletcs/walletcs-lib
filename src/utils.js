import { ethers } from 'ethers';
import Papa from 'papaparse';
import { FileTransactionGenerator } from './walletcs';

export default class ConverterCSVToJSON {
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
        let tx = {data: '0x'};
        tx['nonce'] = nonce + i;
        let row = result.data[i];
        tx['to'] = row[0];
        tx['value'] = ethers.utils.parseEther(row[1]);
        tx['from'] = this._publicKey;
        paramsArray.push(tx)
      }
      return paramsArray;
    }
    return null;
  }
}
