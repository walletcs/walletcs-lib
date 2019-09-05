const Uxto = {
  address: '',        // String
  satoshi: 0,         // Integer
  txId: '',           // String
  outputIndex: '',    // String
  script: ''          // String
};

const EtherTransaction = {
  to: '',             // String
  from: '',           // String
  data: '0x0',        // String
  nonce: 0,           // Integer
  gasLimit: 0,        // Integer
  gasPrice: 0,        // Integer
  value: 0,           // Integer
};

const EtherFileTransaction = {
  publicKey: '',       // String
  transactions: [],    // List[<EtherTransaction>]
  contract: []         // List[<ABI>]
};

const BitcoinFileTransaction = {
  from: [],           // List[String]
  to: [],             // List[String]
  amounts: [],        // List[Float]
  change: 0,          // Float
  fee: 0,             // Float
  changeAddress: '',  // String
  outx: []            // List[<Outx>]
};

module.exports = {
  Uxto,
  EtherTransaction,
  EtherFileTransaction,
  BitcoinFileTransaction,
};
