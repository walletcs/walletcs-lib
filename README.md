### Packet is wrapper for work with blockchain crypto currency. ###
This package helpful work with walletcs.com applications.
walletcs.js:

1. class FileTransactionGenerator
Class for generate a file with transactions in the json format.
Example:
```javascript
const tx = {
    to: '0X00000000000000000000000000000000000000',
    data: "0x",
    gasLimit: 21000,
    nonce: 0,
    gasPrice: ethers.utils.bigNumberify("20000000000"),
    value: ethers.utils.parseEther("1.0"),
  };
const contract = '0x0000000000000000000000000000000000001';

let file = new FileTransactionGenerator();
file.addTx(contract, tx);

let json = file.generateJson();

```

2. class FileTransactionReader
Class for reader and parse json format files with transactions.
```javascript
let ftr = new FileTransactionReader(JSON.stringify(file));
ftr.parserFile()
let transactions = ftr.transactions;
//list of transactions [{"transaction": "0x000000000000000000000000000000000000000000000000fffffffffffffffffffffffff"}]
let contract = ftr.contract;
```
