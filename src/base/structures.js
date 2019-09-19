require("@babel/register");

const Outx = {
  address: '',        // String
  satoshis: 0,        // Integer
  txId: '',           // String
  outputIndex: '',    // String
};


const EtherTransaction = {
  to: [],             // List[<TransactionTo>]
  data: '0x',         // String
  nonce: 0,           // Integer
  gasLimit: 0,        // Integer
  gasPrice: 0,        // Integer
  value: 0,           // Integer
};

const EtherContractTransaction = {
    to: '',             // String
    data: '0x',         // String
    nonce: 0,           // Integer
    gasLimit: 0,        // Integer
    gasPrice: 0,        // Integer
};

const EtherFileTransaction = {
  pubKey: '',          // String
  transactions: [],    // List[<EtherTransaction>]
  contracts: []        // List[<ABI>]
};

const BitcoinFileTransaction = {
  from: [],           // List[<TransactionFrom>]
  to: [],             // List[<TransactionTo>]
  fee: 0,             // Float
  changeAddress: '',  // String
  outx: []            // List[<Outx>]
};

const TransactionFrom = {
  address: '',        // String
  change: false       // Bool
};

const TransactionTo = {
  address: '',        // String
  amount: 0.0         // Float
};

const BitcoinInput = {
  txId: '',           // String
  outputIndex: '',    // String
  address: '',        // String
  satoshis: '',       // String
  script: '',         // String
  signatures: []      // String

};

const Signature = {
  publicKey: '',
  prevTxId:  '',
  outputIndex: '',
  inputIndex: '',
  signature: '',
  sigtype: '',
};

module.exports = {
  Outx,
  EtherTransaction,
  EtherFileTransaction,
  BitcoinFileTransaction,
  BitcoinInput,
  EtherContractTransaction,
  Signature
};
