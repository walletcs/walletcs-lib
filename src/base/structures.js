require("@babel/register");

const Outx = {
  address: '',        // String
  satoshis: 0,         // Integer
  txId: '',           // String
  outputIndex: '',    // String
};


const EtherTransaction = {
  to: '',             // String
  data: '0x',         // String
  nonce: 0,           // Integer
  gasLimit: 0,        // Integer
  gasPrice: 0,        // Integer
  from: '',           // String
  value: 0,           // Integer
};

const EtherContractTransaction = {
    to: '',             // String
    from: '',
    data: '0x',         // String
    nonce: 0,           // Integer
    gasLimit: 0,        // Integer
    gasPrice: 0,        // Integer
};

const EtherFileTransaction = {
  pubKey: '',       // String
  transactions: [],    // List[<EtherTransaction>]
  contracts: []         // List[<ABI>]
};

const BitcoinFileTransaction = {
  from: [],           // List[String]
  to: [],             // List[String]
  amount: [],        // List[Float]
  fee: 0,             // Float
  changeAddress: '',  // String
  outx: []            // List[<Outx>]
};

const BitcoinInput = {
  txId: '',           // String
  outputIndex: '',    // String
  address: '',        // String
  satoshis: '',       // String
  script: '',         // String

};

module.exports = {
  Outx,
  EtherTransaction,
  EtherFileTransaction,
  BitcoinFileTransaction,
  BitcoinInput,
  EtherContractTransaction
};
