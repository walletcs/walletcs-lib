const ethers = require('ethers');
const bip39 = require ('bip39');
const bip32 = require('bip32');
const bitcoinjs = require('bitcoinjs-lib');
const bitcore = require('bitcore-lib');
const walletcs = require('./base/walletc');
const errors = require('./base/errors');
const _ = require('lodash');

const SEARCH_DEPTH = 1000;

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

  static getPublicKeyFromPrivateKey(privateKey){
    const publicKey = bitcore.PublicKey(bitcore.PrivateKey(privateKey));
    return publicKey.toString();
  }

  static getSignatures(signedTx, privateKey){
    const tx = new bitcore.Transaction(signedTx);
    return tx.getSignatures(privateKey);
  }

  combineMultiSignSignatures(unsignedTx, signatures) {
    const tx = this.__builtTx(unsignedTx);
    _.each(signatures, function (signature) {
      _.each(signature, function (sign) {
        tx.addSignature(sign);
      })
    });
    return tx.serialize();
  }

  __builtTx(unsignedTx){
    try {
      const tx = new bitcore.Transaction();
      if(unsignedTx.threshold){
        tx.from(unsignedTx.inputs, unsignedTx.from, unsignedTx.threshold)
      }else{
        tx.from(unsignedTx.inputs);
      }
      const addresses = _.zipWith(unsignedTx.to, unsignedTx.amounts,
        function (to, amount) {
          return {'address': to, 'satoshis': amount};
      });
      tx.to(addresses);
      tx.change(unsignedTx.changeAddress);
      tx.fee(tx.getFee());
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
      const child1b = root
      .derive(0)
      .derive(number_address);
      return {'address': getAddress(child1b, this.network), 'privateKey': child1b.toWIF()}
    }catch (e) {
      throw Error(errors.XPRIV)
    }
  };

  searchAddressInParent(xpriv, address, depth) {
    for (let i = 0; i < depth || SEARCH_DEPTH; i += 1) {
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
        tx.sign(new bitcore.PrivateKey(prv));
    }catch (e) {
      throw Error(errors.PRIVATE_KEY);
    }
    return tx.serialize()
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
      return {'address': standardEthereum.address, 'privateKey': standardEthereum.privateKey}
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
    for (let i = 0; i < depth || SEARCH_DEPTH; i += 1) {
      console.log( depth || SEARCH_DEPTH, i);
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
