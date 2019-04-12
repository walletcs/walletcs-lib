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
    if(amount < 540) throw Error('Amount should be more 540 satoshi.');
    
    try{
      const response = await axios.get(this.urlAddress);
      const unspent = response.data.txrefs;
      
      if(response.data.balance < amount) throw Error('Too low balance.');
      
      let unspent_value = 0;
      for(let key in unspent){
        unspent_value += unspent[key].value;
        
        this.rawTx.outxs.push({txId: unspent[key].tx_hash, vout: unspent[key].tx_output_n});
        
        if(unspent_value > amount) break;
      }
  
      this.rawTx.amount = amount;
      this.rawTx.to = address;
      this.rawTx.attempt_spent = unspent_value;
  
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
    
    for(let key in rawTx.outxs){
      txBuilder.addInput(rawTx.outxs[key].txId, rawTx.outxs[key].vout)
    }
    
    let fee = rawTx.outxs.length*34 + 180 + 10; // 34 average size output. 180 average size input and 10 for over
    
    txBuilder.addOutput(rawTx.to, rawTx.amount);
    txBuilder.addOutput(rawTx.from, rawTx.attempt_spent - rawTx.amount - fee);
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
  
  static generateKeyPair = () => {
    let keyPair = ECPair.makeRandom();
    return [keyPair.getAddress(), keyPair.toWIF()]
  }
};

export const checkBitcoinAdress = (address) => {
  if (address.length < 26 || address.length > 35) {
    return false;
  }
  let re = /^[A-Z0-9]+$/i;
  
  return re.test(address)
};
