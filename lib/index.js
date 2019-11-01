"use strict";

var parsers = require("./parsers");

var walletcs = require("./walletcs");

module.exports = {
  BitcoinWalletHD: walletcs.BitcoinWalletHD,
  EtherWalletHD: walletcs.EtherWalletHD,
  JSONParser: parsers.JSONParser
};