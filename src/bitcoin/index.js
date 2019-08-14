import 'babel-polyfill';
import { TransactionBuilder, ECPair, networks, payments } from 'bitcoinjs-lib';
import { Script, Transaction, PrivateKey, Address } from 'bitcore-lib';
import axios from 'axios';

const feePeerKb = 44;
const minSum = 540;
const avarageInputSize = 180;
const avarageOutputSize = 44;
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
  return parseInt(parseFloat(val)*Math.pow(10, 8))
};

const filterUniq = (array) => {
  return array.filter((value, index, self) => self.indexOf(value) === index)
};

const calculateMinerFee = (outxs, amounts) => {
    return (outxs.length * avarageInputSize + amounts.length * avarageOutputSize) * feePeerKb;
  };

export class BitcoinTransaction {
  constructor(network, jsonTransaction) {
    this.network = network;
    this._jsonTransaction = jsonTransaction || {
      outxs: [],
      to:[],
      amounts: [],
      changeAddress: null,
      fee: null
    };
    this._transaction = null;
  }

  static signRawTransaction(serializedTx, prv) {
    const tx = Transaction(serializedTx);
    return tx.sign(prv).serialize()
  }

  async getUnspentTx(address) {
    const response = await axios.get(`https://api.blockcypher.com/v1/btc/${this.network}/addrs/${address}?unspentOnly=true`);
    const unspentTransactions = [];
    if (response.data.unconfirmed_txrefs) {
      for (let i = 0; i < response.data.unconfirmed_txrefs.length; i += 1) {
        const item = response.data.unconfirmed_txrefs[i];
        if (!item.double_spend) {
          //if there is unconfirmed transaction but there is my public address here
          if (item.address === address) {
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
  async createTx(from, to, amount, changeAddress, fee, type) {
    if (type === 'single') {
      await this._createJsonTransaction(from, to, amount, changeAddress, fee, type)
    }
    return null
  };

  async _createJsonTransaction(fromAddresses, toAddresses, amounts, changeAddress, fee, type) {
    const outxs = await this._prepareOutxs(fromAddresses);
    const amountsSatoshi = amounts.map( val => _convertToSatoshi(val));
    const getSum = (total, num) => total + num;
    const totalAmountSatoshi = amountsSatoshi.reduce(getSum);
    let balance = 0;

    for (let u=0; u < outxs.length; u += 1){
      for (let i=0; i < outxs[u].outxs.length; i += 1){
        if (balance < totalAmountSatoshi){
          let item = outxs[u].outxs[i];
          let from = outxs[u].from;
          let utxo = {
            'txId': item.tx_hash,
            'outputIndex': item.tx_output_n,
            'address': from,
            'satoshis': item.value
          };
          balance += item.value;
          this._jsonTransaction.outxs.push(utxo);
        }
      }
    }

    if (totalAmountSatoshi > balance) throw Error('Too low balance.');

    if (amountsSatoshi.find( val => val < minSum)) throw new Error('Amount should be more 540 satoshi.');

    this._jsonTransaction.changeAddress = changeAddress || null;
    this._jsonTransaction.fee = fee ? _convertToSatoshi(fee) : calculateMinerFee(this._jsonTransaction.outxs, amountsSatoshi);
    this._jsonTransaction.to = toAddresses;
    this._jsonTransaction.amounts = amountsSatoshi;
    this._jsonTransaction.type = type;

    this.buildTransaction()
  }

  async _prepareOutxs(fromAddresses) {
    let uniqFromAddresses = filterUniq(fromAddresses);
    const outxs = [];
    for (let k=0; k < uniqFromAddresses.length; k += 1){
      const from = uniqFromAddresses[k];
      const transactionInfo = {from, outxs: []};
      const [unspentTransactions, balance] = await this.getUnspentTx(from);
      for (let v=0; v < unspentTransactions.length; v += 1){
        transactionInfo.outxs.push(unspentTransactions[v]);
      }
      outxs.push(transactionInfo);

    }
    return outxs;
  }
  
  buildTransaction() {
    if (!this._jsonTransaction.outxs.length) throw Error(
      'This method can\'t call before the createTransaction method ' +
      'or if the instance was create without the parameter jsonTransaction.');
    let totalValue = 0;

    let transaction = new Transaction();
    
    // Add script to the outx and add to the transaction
    for (let i = 0; i < this._jsonTransaction.outxs.length; i++) {
      let item = this._jsonTransaction.outxs[i];
      item.script = new Script(Address(this._jsonTransaction.outxs[i].address)).toHex();
      totalValue += item.satoshis;
      transaction.from(item)
    }
    
    let totalOutput = 0;
    for (let i = 0; i < this._jsonTransaction.to.length; i += 1) {
      transaction.to(this._jsonTransaction.to[i], this._jsonTransaction.amounts[i]);
      totalOutput +=  this._jsonTransaction.amounts[i];
    }
    
    let fee = this._jsonTransaction.fee;
    transaction.fee(fee);
    
    let change = parseInt(totalValue - totalOutput - fee);
    if (change < 0) throw Error('Error balance for current account.Check you account balance.');
    if (0 < change && change < minSum) change = 0;
    if (change) transaction.change(this._jsonTransaction.changeAddress || this._jsonTransaction.outxs[0].address);

    this._transaction = transaction
  }

  getJsonTransaction () {
    return JSON.stringify(this._jsonTransaction);
  }

  getRawTransaction() {
    if (!this._transaction) this.buildTransaction();
    return this._transaction.serialize();
  }

  sign(privateKeys){
    if (!this._transaction) throw Error('Transaction wasn\'t created.');
    const prvks = Array.isArray(privateKeys) ? privateKeys : [privateKeys];
    this._transaction.sign(prvks.map( key => new PrivateKey(key)));
  }

  static async broadcastTx(rawTx, network){
   let urlPush = `https://api.blockcypher.com/v1/btc/${network}/txs/push`;
   return await axios.post(urlPush, JSON.stringify({tx: rawTx}))

  }
}

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
};
