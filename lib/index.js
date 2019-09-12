"use strict";

require('babel-polyfill');

require("@babel/register");

var parsers = require("./parsers");

var walletcs = require("./walletcs");

module.exports = {
  BitcoinWalletHD: walletcs.BitcoinWalletHD,
  EtherWalletHD: walletcs.EtherWalletHD,
  JSONParser: parsers.JSONParser
};