const Outx = {
  address: '',        // String
  satoshis: 0,        // Integer
  txId: '',           // String
  outputIndex: '',    // String
};

const EtherTransaction = {

  to: [],             // List[<TransactionTo>]
  from: [],           // List[<TransactionFrom>]
  data: '0x',         // String
  nonce: 0,           // Integer
  gasLimit: 0,        // Integer
  gasPrice: 0,        // Integer
};

const EtherFileTransaction = {
  transactions: [],    // List[<EtherTransaction>]
  contracts: []        // List[<ABI>]
};

const BitcoinFileTransaction = {
  from: [],           // List[<TransactionFrom>]
  to: [],             // List[<TransactionTo>]
  fee: 0,             // Float
  outx: []            // List[<Outx>]
};

const BitcoinTransactionFrom = {
  address: '',        // String
  change: false       // Bool
};

const EtherTransactionFrom = {
  address: '',        // String
};

const TransactionTo = {
  address: '',        // String
  amount: 0.0         // Float
};

const ContractTransactionTo = {
  address: ''         // String
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
  Signature,
  EtherTransactionFrom,
  BitcoinTransactionFrom,
  TransactionTo,
  ContractTransactionTo
};
