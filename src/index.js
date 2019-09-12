require('babel-polyfill');
require("@babel/register");

const parsers = require("./parsers");
const walletcs = require("./walletcs");


module.exports = {
  BitcoinWalletHD: walletcs.BitcoinWalletHD,
  EtherWalletHD: walletcs.EtherWalletHD,
  JSONParser: parsers.JSONParser
};
