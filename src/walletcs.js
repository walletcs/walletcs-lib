"use strict";
require("babel-core/register");
require("babel-polyfill");
const ethers = require('ethers');
const bip39 = require ('bip39');
const bip32 = require('bip32');
const bitcoinjs = require('bitcoinjs-lib');
const bitcore = require('bitcore-lib');
const walletcs = require('./base/walletc');
const _ = require('lodash');

const DEEP_SEARCH = 1000;

const _chooseNetwork = (network) =>
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

  __builtTx(unsignedTx){
    const tx = new bitcore.Transaction();
    tx.from(unsignedTx.inputs);
    const addresses = _.zipWith(unsignedTx.to, unsignedTx.amounts,
      function (to, amount) {
        return {'address': to, 'satoshis': amount};
    });
    tx.to(addresses);
    tx.change(unsignedTx.changeAddress);
    tx.fee(tx.getFee());

    return tx;
  }

  async getFromMnemonic(mnemonic) {
    if (!bip39.validateMnemonic(mnemonic)) throw Error('Not valid mnemonic.');
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed, this.network);
    return {'xPub': root.neutered().toBase58(), 'xPriv': root.toBase58()} // xPub, xPriv
  }

  // BIP32
  getAddressFromXpub(xpub, number_address) {
    // Use BIP32 method for get child key
    const address = bitcoinjs.payments.p2pkh({
      pubkey: bip32.fromBase58(xpub, this.network).derive(0).derive(number_address).publicKey,
      network: this.network
    }).address;

    return address
  };

  getxPubFromXprv(xprv) {
    const node = bip32.fromBase58(xprv, this.network);

    return node.neutered().toBase58();
  }

  getAddressWithPrivateFromXprv(xprv, number_address) {
    // Use BIP32 method for get child key
    const root = bip32.fromBase58(xprv, this.network);
    const child1b = root
      .derive(0)
      .derive(number_address);
    return {'address': getAddress(child1b, this.network), 'privateKey': child1b.toWIF()}

  };

  searchAddressInParent(xprv, address, deep) {
    for (let i = 0; i < deep || DEEP_SEARCH; i += 1) {
      let pair = this.getAddressWithPrivateFromXprv(xprv, i);
      if (pair.address === address){
        return pair
      }
    }
    return null
  }

  async signTransactionByPrivateKey(prv, unsignedTx){
    const tx = this.__builtTx(unsignedTx);
    tx.sign(new bitcore.PrivateKey(prv));
    return tx.serialize()
  }

  async signTransactionByxPriv(xpriv, unsignedTx, addresses) {
    const tx = this.__builtTx(unsignedTx);
    for(let i = 0; i < addresses.length; i += 1){
      const pair = this.searchAddressInParent(xpriv, addresses[i]);
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
    return unsignedTx.getTx();
  }

  getFromMnemonic (mnemonic) {
    ethers.utils.HDNode.isValidMnemonic(mnemonic);
    const node = ethers.utils.HDNode.fromMnemonic(mnemonic);
    return {'xPub': node.neuter().extendedKey, 'xPrv': node.extendedKey} // returns xPub xPrv
  }

  getAddressWithPrivateFromXprv(xprv, number_address) {
    // Use BIP32 method for get child key
    const root = ethers.utils.HDNode.fromExtendedKey(xprv);
    const standardEthereum = root.derivePath(`0/${number_address || 0}`);
    return {'address': standardEthereum.address, 'privateKey': standardEthereum.privateKey}
  };

  getAddressFromXpub(xpub, number_address) {
    // Use BIP32 method for get child key
    const root = ethers.utils.HDNode.fromExtendedKey(xpub);
    const standardEthereum = root.derivePath(`0/${number_address || 0}`);
    return standardEthereum.address
  }

  searchAddressInParent(xprv, address, deep) {
    for (let i = 0; i < deep || DEEP_SEARCH; i += 1) {
      let pair = this.getAddressWithPrivateFromXprv(xprv, i);
      if (pair.address === address){
        return pair
      }
    }
    return null
  }

  async signTransactionByPrivateKey(prv, unsignedTx){
    const tx = this.__builtTx(unsignedTx);
    const wallet = new ethers.Wallet(prv);
    return await wallet.sign(tx);
  }

  async signTransactionByxPriv(xpriv, unsignedTx, addresses) {
      const pair = this.searchAddressInParent(xpriv, addresses);
      if (pair) {
       return await this.signTransactionByPrivateKey(pair.privateKey, unsignedTx)
      }
    return null
  }

}

module.exports = {
  BitcoinWalletHD,
  EtherWalletHD
};
