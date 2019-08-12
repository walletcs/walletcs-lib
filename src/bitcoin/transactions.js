import 'babel-polyfill';
import { TransactionBuilder, ECPair, networks, payments } from 'bitcoinjs-lib';
import { Script, Transaction, PrivateKey, Address } from 'bitcore-lib';
import axios from 'axios';

const feePeerKb = 71050; // 71050 satoshminSumies 0.43$/kb fee
const minSum = 540;
const coficient = Math.pow(10, 8);

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

const _convertToSatoshi = (val) => {
  return parseFloat(val)*Math.pow(10, 8)
};

export class TransactionBitcoin {
  constructor(fromAddresses, network) {
    _chooseNetwork(network);
    this.fromAddresses = fromAddresses.filter((value, index, self) => self.indexOf(value) === index)
  }

  async getUnspentTx(address) {
    const response = await axios.get(`https://api.blockcypher.com/v1/btc/${network}/addrs/${address}?unspentOnly=true`);
    const unspentTransactions = [];
    if (response.data.unconfirmed_txrefs) {
      for (let i = 0; i < response.data.unconfirmed_txrefs.length; i += 1) {
        const item = response.data.unconfirmed_txrefs[i];
        if (!item.double_spend) {
          //if there is unconfirmed transaction but there is my public address here
          if (item.address === this.rawTx.from) {
            unspentTransactions.push(item);
          }
        }
        else {
          throw new Error("Detected double spent on unconfirmed transactions");
        }
      }
    }
    if (response.data.txrefs) {
      for (let i = 0; i < response.data.txrefs.length; i++) {
        const item = response.data.txrefs[i];
        if (!item.double_spend) {
          unspentTransactions.push(item);
        } else {
          throw new Error("Detected double spent on confirmed transactions");
        }
      }
    }
    return [unspentTransactions, response.data.balance];
  }
  // value for convert btc to satoshi.
  async createTx(to, amount, satoshi, batch) {
    if (!batch) {
      return this.createOneTx(to, amount, satoshi)
    } else {
      return this.createBatchTx(to, amount, satoshi)
    }
  };


  async createBatchTx(amount, address) {
    const [unspentTransactions, balance] = await this.getUnspentTx();
    amount = amount.map( val => _convertToSatoshi(val));
    
    const getSum = (total, num) => {
      return total + num;
    };
    if (amount.reduce(getSum) > balance) throw Error('Too low balance.');
  
    if (amount.find( val => val < minSum)) throw new Error('Amount should be more 540 satoshi.');
  
    for (let i = 0; i < unspentTransactions.length; i++) {
      let item = unspentTransactions[i];
      let utxo = {
        'txId': item.tx_hash,
        'outputIndex': item.tx_output_n,
        'address': this.rawTx.from,
        'satoshis': item.value
      };
      this.rawTx.outxs.push(utxo);
    }
    this.rawTx.to = address;
    this.rawTx.amount = amount;
    this.rawTx.type = 'batch';
    
    return this.rawTx;
  }

  async createOneTx(toAddresses, amounts, satoshi) {
    const transactions = {assetUnspentTx: [], assetTo: []};
    for (let k=0; k < this.fromAddresses; k += 1){
      const from = this.fromAddresses[k];
      const transactionInfo = {from, outxs: []};
      const [unspentTransactions, balance] = await this.getUnspentTx(from);

      for (let v=0; v < unspentTransactions.length; v=0){

        transactionInfo.outxs.push({
          txId: unspentTransactions[key].tx_hash,
          vout: unspentTransactions[key].tx_output_n,
          value: unspentTransactions[key].value
        });
      }
      transactions.push(transactionInfo);

      //
      // if (!toAddresses.length) {
      //   let fee = (transactionInfo.outxs.length * 34 + 180 + 10 + 34) * 44; // 34 average size output. 180 average size input and 10 for over. 44 satoshis/byte
      //   let change = transactionInfo.attempt_spent - amount - fee;
      //   if (change < 0) throw Error('Error balance for current account.Check you account balance.');
      //
      //   if (0 < change && change < minSum) change = 0;
      //
      //   transactionInfo.fee = fee;
      //   if (change !== 0) this.rawTx.change = change;
      // }

    }
    for (let i=0;  i < toAddresses.length; i +=1 ){
      const amount = amounts[i];
      const to = toAddresses[i];
      transactions.assetTo.push({to, amount});
    }
    return transactions;
    // for (let i = 0; i < this.fromAddresses.length; i += 1) {
    //   const transactionInfo = {outxs: [], from: this.fromAddresses[i]};
    //   const [unspentTransactions, balance] = await this.getUnspentTx(this.fromAddresses[i]);
    //
    //   if (!amount.length || !toAddresses.length) throw Error('\'amount\' and \'address\' are required arguments');
    //
    //   for(let i = 0; i < toAddresses.length; i += 1) {
    //     const amount = parseFloat(amounts[i]);
    //     if (satoshi) amount = amount * coficient;  // If not satoshi convert btc to satoshi
    //
    //     if (amount < satoshi ? minSum : minSum / coficient) throw new Error('Amount should be more 540 satoshi.');
    //
    //     let unspent_value = 0;
    //     for (let key in unspentTransactions) {
    //       unspent_value += unspentTransactions[key].value;
    //
    //       transactionInfo.outxs.push({
    //         txId: unspentTransactions[key].tx_hash,
    //         vout: unspentTransactions[key].tx_output_n,
    //         value: unspentTransactions[key].value
    //       });
    //       unspentTransactions.slice(key, 1);
    //
    //       if (unspent_value >= amount) break;
    //     }
    //     if (!unspentTransactions.length) break;
    //   }
    //
    //   transactionInfo.amount = amount;
    //   transactionInfo.attempt_spent = unspent_value;
    //
    //   if (unspent_value === 0) throw Error('Error balance for current account.Check you account balance.');
    //
    //
    //   let fee = (transactionInfo.outxs.length * 34 + 180 + 10 + 34) * 44; // 34 average size output. 180 average size input and 10 for over. 44 satoshis/byte
    //   let change = transactionInfo.attempt_spent - amount - fee;
    //   if (change < 0) throw Error('Error balance for current account.Check you account balance.');
    //
    //   if (0 < change && change < minSum) change = 0;
    //
    //   transactionInfo.fee = fee;
    //   if (change !== 0) this.rawTx.change = change;
    //   return this.rawTx
    // }
  }
  
  static signSingleTx(network, privateKey, rawTx) {
    let txBuilder = new TransactionBuilder(network);
    let _private = ECPair.fromWIF(privateKey, network);
  
    // If the response transaction returns 0 outputs
    if (!rawTx.outxs.length) throw Error('Error balance for current account.Check your transaction');
  
    for(let key in rawTx.outxs){
      txBuilder.addInput(rawTx.outxs[key].txId, rawTx.outxs[key].vout)
    }
  
    txBuilder.addOutput(rawTx.to, rawTx.amount);
  
    txBuilder.addOutput(rawTx.from, rawTx.change);
  
    for (let i = 0; i < rawTx.outxs.length; i += 1) {
      txBuilder.sign(i, _private);
    }
  
    return txBuilder.build().toHex()
  }
  
  static signBatchTx(network, privateKey, rawTx) {
    let script = new Script(Address(rawTx.from)).toHex();
  
    let prvKey = new PrivateKey(privateKey);
  
    let totalValue = 0;
  
    let transaction = new Transaction();
    
    // Add script to the outx and add to the transaction
    for (let i = 0; i < rawTx.outxs.length; i++) {
      let item = rawTx.outxs[i];
      item.script = script;
      totalValue += item.satoshis;
      transaction.from(item)
    }
    
    let totalOutput = 0;
    for (let i = 0; i < rawTx.to.length; i += 1) {
      transaction.to(rawTx.to[i], rawTx.amount[i]);
      totalOutput += rawTx.amount[i];
    }
    
    let fee = Math.floor(feePeerKb * transaction._estimateSize() / 1024);
    transaction.fee(fee);
    
    let change = totalValue - totalOutput - fee;
    if (change < 0) throw Error('Error balance for current account.Check you account balance.');
    if (0 < change && change < minSum) change = 0;
    if (change) transaction.change(rawTx.from);
  
    transaction.enableRBF().sign(prvKey);
    
    return transaction.serialize();
  }

  static sign(privateKey, rawTx, network){
    network = _chooseNetwork(network);
    if (rawTx.type === 'single'){
      return this.signSingleTx(network, privateKey, rawTx);
    }
    if (rawTx.type === 'batch'){
      return this.signBatchTx(network, privateKey, rawTx);
    }
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
};

export const privateKeyIsMainNet = (pr) => {
  const prefixes = ['K', 'L', '5', 'xprv'];
  for (let i = 0; i < prefixes.length; i += 1) {
    if (pr.startsWith(pr[i])){
      return true
    }
  }
  return false;
};

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

export const representBtcTx = (tx) => {
  let newTx = JSON.parse(JSON.stringify(tx));
  if (tx.amount) {
    newTx.amount = tx.amount / Math.pow(10, 8);
  }
  return newTx;
}
