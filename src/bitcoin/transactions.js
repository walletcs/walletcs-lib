import 'babel-polyfill';
import {TransactionBuilder, ECPair, networks, payments} from 'bitcoinjs-lib';
import axios from 'axios';

const _chooseNetwork = (network) =>
    // Choose between two networks testnet and main
{
  if (!network && (network !== 'test3' || network !== 'main')) {
    throw Error('network parameter is required and must be one of "main" or "test3"')
  }
  if (network === 'test3'){
    return networks.testnet
  }
  else {
    return networks.bitcoin
  }
};

export class TransactionBitcoin {
  constructor(publicKey, network) {
    _chooseNetwork(network);
    this.urlAddress = `https://api.blockcypher.com/v1/btc/${network}/addrs/${publicKey}?unspentOnly=true`;
    this.rawTx = {'outxs': [], from: publicKey};
  }

  async createTx(amount, address, value){
    if(!amount || !address) throw Error('\'amount\' and \'address\' are required arguments');
    if(!value) amount = amount * 100000000 // If not value convert btc to satoshi
    amount = parseFloat(amount);
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

      if (unspent_value === 0) throw Error('Error balance for current account.Check you account balance.');
      this.rawTx.attempt_spent = unspent_value;


      let fee = (this.rawTx.outxs.length*34 + 180 + 10 + 34) * 44; // 34 average size output. 180 average size input and 10 for over. 44 satoshis/byte
      let change = this.rawTx.attempt_spent - this.rawTx.amount - fee;
      if (change < 0) throw Error('Error balance for current account.Check you account balance.');

      if (0 < change && change < 540) change = 0;

      this.rawTx.fee = fee;
      if(change !== 0) this.rawTx.change = change;
      return this.rawTx

    }catch (e) {
      console.error(e);

      return this.rawTx
    }
  }

  static sign(privateKey, rawTx, network){
    network = _chooseNetwork(network);
    let txBuilder = new TransactionBuilder(network);
    let _private = ECPair.fromWIF(privateKey, network);

    // If the response transaction returns 0 outputs
    if (!rawTx.outxs.length) throw Error('Error balance for current account.Check your transaction');

    for(let key in rawTx.outxs){
      txBuilder.addInput(rawTx.outxs[key].txId, rawTx.outxs[key].vout)
    }

    txBuilder.addOutput(rawTx.to, rawTx.amount);
    console.log(rawTx.from, rawTx.change, rawTx);
    txBuilder.addOutput(rawTx.from, rawTx.change);
    txBuilder.sign(0, _private);

    return txBuilder.build().toHex();
  }

  static async broadcastTx(rawTx, network){
   let urlPush = `https://api.blockcypher.com/v1/btc/${network}/txs/push`;
   return await axios.post(urlPush, JSON.stringify({tx: rawTx}))

  }
};

export const checkBitcoinAdress = (address) => {
  if (address.length < 26 || address.length > 35) {
    return false;
  }
  let re = /^[A-Z0-9]+$/i;

  return re.test(address)
};

export const addressIsMainNet = (address) => {
  const prefixes = ['1', '3', 'xpub', 'bc1'];
  for (let i = 0; i < prefixes.length; i += 1) {
    if (address.startsWith(prefixes[i])){
      return true
    }
  }
  return false;
}

export const privateKeyIsMainNet = (pr) => {
  const prefixes = ['K', 'L', '5', 'xprv'];
  for (let i = 0; i < prefixes.length; i += 1) {
    if (pr.startsWith(pr[i])){
      return true
    }
  }
  return false;

}

export class BitcoinCheckPair {

  static generatePair(network){
    let _network = _chooseNetwork(network);
    let keyPair = ECPair.makeRandom({network: _network});
    const { address } = payments.p2pkh({ pubkey: keyPair.publicKey, network: _network });
    return [address, keyPair.toWIF()]
  };

  static recoveryPublicKey(privateKey, network){
    let _network = _chooseNetwork(network);
    let keyPair = ECPair.fromWIF(privateKey, _network);
    let { address } = payments.p2pkh({ pubkey: keyPair.publicKey, network: _network });
    return address ;

  }

  static checkPair(pubK, privateK, network){
    let _network = _chooseNetwork(network);
    let keyPair = ECPair.fromWIF(privateK, _network);
    let { address } = payments.p2pkh({ pubkey: keyPair.publicKey,  network: _network });
    return address === pubK
  }
}
