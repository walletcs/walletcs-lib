const ethers = require('ethers');
const bip39 = require ('bip39');
const bip32 = require('bip32');
const bitcoinjs = require('bitcoinjs-lib');
const bitcore = require('bitcore-lib');
const walletcs = require('./base/walletc');
const transactions = require('./transactions');
const structures = require('./base/structures');
const errors = require('./base/errors');
const _ = require('lodash');

const SEARCH_DEPTH = 1000;

function convertToBitcoreTx(data) {
  const tx = bitcore.Transaction();
  tx.from(data.from);
  tx.to(data.to);
  tx.change(data.changeAddress);
  tx.fee(data.fee);
  
  return tx
}

// function convertToWalletCSTx(data) {
//   const _tx = new bitcore.Transaction(data);
//   const tx = structures.BitcoinFileTransaction;
//   tx.changeAddress =
// }

function _chooseNetwork(network)
    // Choose between two networks testnet and main
{
  if (!network && (network !== 'test3' || network !== 'main')) {
    throw Error('network parameter is required and must be one of "main" or "test3"')
  }
  if (network === 'test3'){
    return bitcoinjs.networks.testnet
  }
  else {
    return bitcoinjs.networks.bitcoin
  }
};

function _convertNetworkBitcoinjsToBitcore(network){
  if (network === 'test3') return 'testnet';
  return 'livenet'
}

function getAddress (node, network) {
  return bitcoinjs.payments.p2pkh({ pubkey: node.publicKey, network }).address
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

class BitcoinWalletHD extends walletcs.WalletHDInterface {
  constructor(network) {
    super();
    this.network = _chooseNetwork(network)
  }
  // BIP39
  static generateMnemonic() {
    return bip39.generateMnemonic();
  }

  static validateMnemonic(mnemonic){
    return bip39.validateMnemonic(mnemonic);
  }

  static createMultiSignAddress (required, network, addresses){
    const address = new bitcore.Address(addresses, required, _convertNetworkBitcoinjsToBitcore(network));
    return address.toString();
  }

  // signMultiSignTx(privateKey, multiSignTx){
  //   const tx = new bitcore.Transaction(multiSignTx);
  //   console.log(tx.toObject());
  //   return tx.sign(new bitcore.PrivateKey(privateKey)).uncheckedSerialize();
  //
  // }

  createMultiSignTx(data){
    let threshold = data.threshold;
    if (!threshold){
      threshold = data.from.length;
    }

    const builder = new transactions.BitcoinTxBuilder();
    const director = new transactions.TransactionConstructor(builder);
    const unsignedTx = director.buildBitcoinMultiSignTx(data.outx, data.from, data.to, data.changeAddress, data.fee, threshold);
    return unsignedTx;
  }

  static getPublicKeyFromPrivateKey(privateKey){
    const publicKey = bitcore.PublicKey(bitcore.PrivateKey(privateKey));
    return publicKey.toString();
  }

  combineMultiSignSignatures(multiSignTxs) {
    const self = this;
    const tx = self.__builtTx(multiSignTxs.shift());
    _.each(multiSignTxs, function (tr) {
      _.each(self.__getSignatures(tr), function (signature) {
        tx.applySignature(signature);
      })
    });
    return this.__combineSignatures(multiSignTxs[0], tx);
  }

  __getSignatures(tx){
    const result = [];
    _.each(tx.inputs, function (input) {
      _.each(input.signatures, function (sign) {
        if (sign){
          result.push(new bitcore.Transaction.Signature(sign))
        }
      })
    });
    return result;
  }

  __builtTx(unsignedTx){
    try {
      const tx = new bitcore.Transaction();
      if(unsignedTx.threshold){
        tx.from(unsignedTx.inputs, unsignedTx.from, unsignedTx.threshold);
      }else{
        tx.from(unsignedTx.inputs);
      }
      tx.to(unsignedTx.to);
      tx.change(unsignedTx.changeAddress);
      _.each(this.__getSignatures(unsignedTx), function (signature) {
        tx.applySignature(signature);
      });
      return tx;
    }catch (e) {
      throw Error(errors.TX_FORMAT)
    }
  }

  async getFromMnemonic(mnemonic) {
    if (!bip39.validateMnemonic(mnemonic)) throw Error(errors.MNEMONIC);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed, this.network);
    return {'xPub': root.neutered().toBase58(), 'xPriv': root.toBase58()} // xPub, xPriv
  }

  // BIP32
  getAddressFromXpub(xpub, index) {
    // Use BIP32 method for get child key
    try{
      const address = bitcoinjs.payments.p2pkh({
        pubkey: bip32.fromBase58(xpub, this.network).derive(0).derive(parseInt(index)).publicKey,
        network: this.network
      }).address;
      return address

    }catch (e) {
      throw Error(errors.XPUB)
    }
  };

  getxPubFromXprv(xpriv) {
    try{
      const node = bip32.fromBase58(xpriv, this.network);

      return node.neutered().toBase58();
    }catch (e) {
      throw Error(errors.XPRIV)
    }
  }

  getAddressWithPrivateFromXprv(xpriv, number_address) {
    // Use BIP32 method for get child key
    try{
      const root = bip32.fromBase58(xpriv, this.network);
      const child1b = root.derive(0).derive(number_address);
      return {
        'address': getAddress(child1b, this.network),
        'privateKey': child1b.toWIF(),
        'publicKey': child1b.publicKey.toString('hex')
      }
    }catch (e) {
      throw Error(errors.XPRIV)
    }
  };

  searchAddressInParent(xpriv, address, depth) {
    for (let i = 0; i <= (depth || SEARCH_DEPTH); i += 1) {
      let pair = this.getAddressWithPrivateFromXprv(xpriv, i);
      if (pair.address === address){
        return pair
      }
      if (i >= depth || SEARCH_DEPTH){
        return null
      }
    }
  }

  async signTransactionByPrivateKey(prv, unsignedTx){
    try{
      const tx = this.__builtTx(unsignedTx);
      tx.sign(new bitcore.PrivateKey(prv));
      return tx.uncheckedSerialize();
    }catch (e) {
      throw Error(errors.PRIVATE_KEY);
    }
  }

  async signMultiSignTransactionByPrivateKey(prv, unsignedTx){
    try{

      const tx = this.__builtTx(unsignedTx);
      tx.sign(new bitcore.PrivateKey(prv));
      return this.__combineSignatures(unsignedTx, tx);
    }catch (e) {
      console.log(e);
      throw Error(errors.PRIVATE_KEY);
    }
  }

  __combineSignatures(unsignedTx, signedTx){
    _.each(unsignedTx.inputs, function (input, index) {
      unsignedTx.inputs[index].signatures = _.map(signedTx.inputs[index].signatures, function (signature) {
        if (signature) return signature.toJSON();
      });

    });
    return unsignedTx;
  }

  async signTransactionByxPriv(xpriv, unsignedTx, addresses, depth) {
    const tx = this.__builtTx(unsignedTx);
    for(let i = 0; i < addresses.length; i += 1){
      const pair = this.searchAddressInParent(xpriv, addresses[i], depth);
      if (pair) {
        tx.sign(new bitcore.PrivateKey(pair.privateKey));
      }
      if(tx.isFullySigned()){
        return tx.serialize()
      }
    }
    return null
  }

}

class EtherWalletHD extends walletcs.WalletHDInterface {

  static generateMnemonic() {
    return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16))
  }

  static validateMnemonic(mnemonic) {
    return ethers.utils.HDNode.isValidMnemonic(mnemonic);
  }

  createTx(unsignedTx){
    const tx = this.__builtTx(unsignedTx);
    return tx.toJSON();
  }

  __builtTx(unsignedTx) {
    const tx = unsignedTx.getTx();
    if (!tx) throw (errors.TX_FORMAT);
    return tx;
  }

  async getFromMnemonic (mnemonic) {
    if(!ethers.utils.HDNode.isValidMnemonic(mnemonic)) throw Error(errors.MNEMONIC);
    const node = ethers.utils.HDNode.fromMnemonic(mnemonic);
    return {'xPub': node.neuter().extendedKey, 'xPriv': node.extendedKey} // returns xPub xPriv
  }

  getAddressWithPrivateFromXprv(xpriv, number_address) {
    // Use BIP32 method for get child key
    try {
      const root = ethers.utils.HDNode.fromExtendedKey(xpriv);
      const standardEthereum = root.derivePath(`0/${number_address || 0}`);
      return {
        'address': standardEthereum.address,
        'privateKey': standardEthereum.privateKey,
        'publicKey': standardEthereum.publicKey.toString()
      }
    }catch (e) {
      throw Error(errors.XPRIV)
    }
  };

  getAddressFromXpub(xpub, number_address) {
    // Use BIP32 method for get child key
    try{
      const root = ethers.utils.HDNode.fromExtendedKey(xpub);
      const standardEthereum = root.derivePath(`0/${number_address || 0}`);
      return standardEthereum.address
    }catch (e) {
      throw Error(errors.XPUB)
    }
  }

  searchAddressInParent(xpriv, address, depth) {
    for (let i = 0; i <= (depth || SEARCH_DEPTH); i += 1) {
      let pair = this.getAddressWithPrivateFromXprv(xpriv, i);
      if (pair.address === address){
        return pair
      }
      if (i >= depth || SEARCH_DEPTH){
        return null
      }
    }
  }

  async signTransactionByPrivateKey(prv, unsignedTx){
    const tx = this.__builtTx(unsignedTx);
    try{
      const wallet = new ethers.Wallet(prv);
      return await wallet.sign(tx);
    }catch (e) {
      throw Error(errors.PRIVATE_KEY)
    }
  }

  async signTransactionByxPriv(xpriv, unsignedTx, addresses, depth) {
      for (let i=0; i < addresses.length; i += 1){
        const pair = this.searchAddressInParent(xpriv, addresses[i], depth);
        if (pair) {
         return await this.signTransactionByPrivateKey(pair.privateKey, unsignedTx)
        }
      }
    return null
  }

}

module.exports = {
  BitcoinWalletHD,
  EtherWalletHD
};
