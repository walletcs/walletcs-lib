import 'babel-polyfill';
import {TransactionBuilder, ECPair, networks} from 'bitcoinjs-lib';
import axios from 'axios';


export class TransactionBitcoin {
  constructor(publicKey, network) {
    if (!network) {
      network = 'test3'
    }
    this.urlAddress = `https://api.blockcypher.com/v1/btc/${network}/addrs/${publicKey}?unspentOnly=true`;
    this.urlPush = `https://api.blockcypher.com/v1/btc/${network}/txs/push`;
    this.rawTx = {'outxs': [], from: publicKey};
  }
  
  async createTx(amount, address){
    if(!amount || !address) throw Error('\'amount\' and \'address\' are required arguments');
    
    try{
      const response = await axios.get(this.urlAddress);
      const unspent = response.data.txrefs;

      for(let key in unspent){
        this.rawTx.outxs.push({txId: unspent[key].tx_hash, vout: unspent[key].tx_output_n})
      }
  
      this.rawTx.amount = amount;
      this.rawTx.to = address;
      this.rawTx.balance = response.data.balance;
  
      return this.rawTx
      
    }catch (e) {
      console.error(e);
      
      return this.rawTx
    }
  }
  
  static sign(privateKey, rawTx, network){
    if(!network) network = networks.testnet;
    let txBuilder = new TransactionBuilder(network);
    let _private = ECPair.fromWIF(privateKey, network);
    
    console.log(rawTx)
    for(let key in rawTx.outxs){
      txBuilder.addInput(rawTx.outxs[key].txId, rawTx.outxs[key].vout)
    }
    
    txBuilder.addOutput(rawTx.to, rawTx.amount);
    txBuilder.addOutput(rawTx.from, rawTx.balance - rawTx.amount);
    txBuilder.sign(0, _private);
    
    return txBuilder.build().toHex();
  }
  
  async broadcastTx(rawTx){
    try{
      return await axios.post(this.urlPush, {tx: rawTx})
    }catch (e) {
      console.log(e)
    }
  }
}
