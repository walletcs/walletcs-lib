import "babel-polyfill"

const ethers = require('ethers');
const bitcore = require('bitcore-lib');

const transactions = require('../src/transactions');
const structures = require('../src/base/structures');

const ETHER_ADDRESS = '0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3';
const BITCOIN_ADDRESS = 'n3rkVDVgppH23BYNyWqULfih1nfesc2t3t';

test('Test create empty unspent EtherTx', async () => {
  const etherTx = new transactions.EtherTx();

  expect(etherTx.to).toEqual('');
  expect(etherTx.value).toEqual(0);
  expect(etherTx.gasPrice).toEqual(ethers.utils.bigNumberify(0));
  expect(etherTx.gasLimit).toEqual((ethers.utils.bigNumberify(0)));
  expect(etherTx.nonce).toEqual(0);
  expect(etherTx.data).toEqual('0x')

});

test('Test convert to JSON empty unspent EtherTx', async () => {
   const etherTx = new transactions.EtherTx();
   expect(etherTx.isCompleted()).not.toBeTruthy();
});

test('Test convert to JSON empty unspent EtherContractTx', async () => {
   const etherTx = new transactions.EtherContractTx();
   expect(etherTx.isCompleted()).not.toBeTruthy();
});

test('Test convert EtherTx to JSON', async () => {
  const etherTx = new transactions.EtherTx();
  etherTx.to = '0x000000000000000000000000000000000';
  etherTx.gasPrice = ethers.utils.bigNumberify(1000000000);
  etherTx.gasLimit = ethers.utils.bigNumberify(21000);
  etherTx.value = ethers.utils.parseEther('0.001');
  etherTx.nonce = 1;

  expect(etherTx.toJSON()).toEqual(JSON.stringify(etherTx.__getTX()))
});

test('Test convert EtherContractTx to JSON', async () => {
  const etherTx = new transactions.EtherContractTx();
  etherTx.to = '0x000000000000000000000000000000000';
  etherTx.data = '0x1111';
  etherTx.gasPrice = ethers.utils.bigNumberify(1000000000);
  etherTx.gasLimit = ethers.utils.bigNumberify(21000);
  etherTx.value = ethers.utils.parseEther('0.001');
  etherTx.nonce = 1;

  expect(etherTx.toJSON()).toEqual(JSON.stringify(etherTx.__getTX()))
});

test('Test create unspent BitcoinTx', async () => {
  const bitcoinTx = new transactions.BitcoinTx();

  expect(bitcoinTx.to).toEqual([]);
  expect(bitcoinTx.from).toEqual([]);
  expect(bitcoinTx.changeAddress).toEqual('');
  expect(bitcoinTx.change).toEqual(0);
  expect(bitcoinTx.fee).toEqual(0);
  expect(bitcoinTx.inputs).toEqual([]);
});

test('Test convert to JSON empty unspent BitcoinTx', async () => {
  const bitcoinTx = new transactions.BitcoinTx();
  expect(bitcoinTx.isCompleted()).not.toBeTruthy();
});

test('Test convert BitcoinTx to JSON', async() => {
  const bitcoinTx = new transactions.BitcoinTx();
  bitcoinTx.to = ['0x000000000000000000000000000000000'];
  bitcoinTx.from = ['0x000000000000000000000000000000000'];
  bitcoinTx.amounts = [1000, 10000];
  bitcoinTx.changeAddress = '0x000000000000000000000000000000000';
  bitcoinTx.change = 10000;
  bitcoinTx.fee = 100;
  bitcoinTx.inputs = [{'fake': 'input'}];

  expect(bitcoinTx.toJSON()).toEqual(JSON.stringify(bitcoinTx.__getTX()))
});

test('Test build ether transaction', async () => {
  const builder = new transactions.EtherTxBuilder('rinkeby');
  builder.setToAddress([{address: ETHER_ADDRESS, amount: 2}]);
  builder.setFromAddress([{address: ETHER_ADDRESS}]);
  builder.setNonce(1);
  builder.setGasPrice(1000000000);
  builder.setGasLimit(21000);

  const transaction = builder.getResult();
  expect(transaction.nonce).toEqual(1);
  expect(transaction.to).toEqual(ETHER_ADDRESS);
  expect(transaction.value).toEqual(ethers.utils.parseEther('2'));
  expect(transaction.gasLimit).toEqual(ethers.utils.bigNumberify(21000));
  expect(transaction.gasPrice).toEqual(ethers.utils.bigNumberify(1000000000));
});

test('Test fail build ether transaction', async () => {
  const builder = new transactions.EtherTxBuilder('rinkeby');
  builder.setToAddress([]);
  builder.setGasPrice(1000000000);
  builder.setGasLimit(21000);

  expect(builder.getResult().isCompleted()).not.toBeTruthy();
});


test('Test build bitcoin transaction', async () => {
  const outx = {
    txId: '557bf23415160ce932ea5215e238132bf1cc42c1a7f91846d335d0d1e33cd19f',
    address: BITCOIN_ADDRESS,
    satoshis: 2538851,
    outputIndex: 1
  };
  const builder = new transactions.BitcoinTxBuilder();
  builder.setFromAddress({address: BITCOIN_ADDRESS, change: true});
  builder.setFromAddress({address: BITCOIN_ADDRESS, change: false});
  builder.setToAddress({address: BITCOIN_ADDRESS, amount: 0.0001});
  builder.setToAddress({address: BITCOIN_ADDRESS, amount: 0.0002});
  builder.addOutx(outx);
  builder.calculateFee();

  const transaction = builder.getResult();

  expect(transaction.to[0].address).toEqual(BITCOIN_ADDRESS);
  expect(transaction.to[1].address).toEqual(BITCOIN_ADDRESS);
  expect(transaction.from[0]).toEqual(BITCOIN_ADDRESS);
  expect(transaction.to[0].satoshis).toEqual(0.0001 * Math.pow(10, 8));
  expect(transaction.to[1].satoshis).toEqual(0.0002 * Math.pow(10, 8));
  expect(transaction.changeAddress).toEqual(BITCOIN_ADDRESS);
  expect(transaction.inputs[0].script).not.toEqual(undefined);
  expect(transaction.fee).not.toEqual(0);

});

test('Test build bitcoin transaction with array params', async () => {
  const outx = {
    txId: '557bf23415160ce932ea5215e238132bf1cc42c1a7f91846d335d0d1e33cd19f',
    address: BITCOIN_ADDRESS,
    satoshis: 2538851,
    outputIndex: 1
  };
  const builder = new transactions.BitcoinTxBuilder();
  builder.setFromAddress([{address: BITCOIN_ADDRESS, change: true}, {address: BITCOIN_ADDRESS, change: false}]);
  builder.setToAddress([{address: BITCOIN_ADDRESS, amount: 0.0001}, {address: BITCOIN_ADDRESS, amount: 0.0002}]);
  builder.addOutx(outx);
  builder.calculateFee();
  const transaction = builder.getResult();

  expect(transaction.to[0].address).toEqual(BITCOIN_ADDRESS);
  expect(transaction.to[1].address).toEqual(BITCOIN_ADDRESS);
  expect(transaction.from[0]).toEqual(BITCOIN_ADDRESS);
  expect(transaction.to[0].satoshis).toEqual(0.0001 * Math.pow(10, 8));
  expect(transaction.to[1].satoshis).toEqual(0.0002 * Math.pow(10, 8));
  expect(transaction.changeAddress).toEqual(BITCOIN_ADDRESS);
  expect(transaction.inputs[0].script).not.toEqual(undefined);
  expect(transaction.fee).not.toEqual(0);

});

test('Test build ether contract tx', async () => {
  const builder = new transactions.EtherContractTxBuilder();
  builder.setToAddress({address: ETHER_ADDRESS});
  builder.setMethodName('test');
  builder.setMethodParams([]);
  builder.setData('0x1');
  builder.setNonce(1);
  builder.setGasPrice(1000000000);
  builder.setGasLimit(21000);

  const transaction = builder.getResult();

  expect(transaction.nonce).toEqual(1);
  expect(transaction.to).toEqual(ETHER_ADDRESS);
  expect(transaction.gasLimit).toEqual(ethers.utils.bigNumberify(21000));
  expect(transaction.gasPrice).toEqual(ethers.utils.bigNumberify(1000000000));
  expect(transaction.data).toEqual('0x1');
});

test('Test fail build ether contract tx', async () => {
  const builder = new transactions.EtherContractTxBuilder();
  builder.setToAddress([{address: ETHER_ADDRESS}]);
  builder.setMethodName('test');
  builder.setMethodParams([]);
  builder.setNonce(1);
  builder.setGasPrice(1000000000);
  builder.setGasLimit(21000);

  expect(builder.getResult().isCompleted()).not.toBeTruthy();
});

test('Test director builde etherr tx', async () => {
  const rawTx = structures.EtherTransaction;
  rawTx.nonce = 1;
  rawTx.gasLimit = 21000;
  rawTx.gasPrice = 1000000000;
  rawTx.nonce = 1;
  rawTx.to = [{address: ETHER_ADDRESS, amount: 2}];

  const builder = new transactions.EtherTxBuilder();
  const director = new transactions.TransactionConstructor(builder);
  const transaction = director.buildEtherTx(rawTx);

  expect(transaction.nonce).toEqual(1);
  expect(transaction.to).toEqual(ETHER_ADDRESS);
  expect(transaction.value).toEqual(ethers.utils.parseEther('2'));
  expect(transaction.gasLimit).toEqual(ethers.utils.bigNumberify(21000));
  expect(transaction.gasPrice).toEqual(ethers.utils.bigNumberify((1000000000)));
});


test('Test  director builder ether contract tx', async () => {
  const rawTx = structures.EtherTransaction;
  rawTx.nonce = 1;
  rawTx.gasLimit = 21000;
  rawTx.gasPrice = 1000000000;
  rawTx.nonce = 1;
  rawTx.data = '0x1';
  rawTx.to = [{address: ETHER_ADDRESS}];
  rawTx.abi = [];

  const builder = new transactions.EtherContractTxBuilder();
  const director = new transactions.TransactionConstructor(builder);
  const transaction = director.buildEtherContractTx(rawTx, rawTx.abi);

  expect(transaction.nonce).toEqual(1);
  expect(transaction.to).toEqual(ETHER_ADDRESS);
  expect(transaction.gasLimit).toEqual(ethers.utils.bigNumberify(21000));
  expect(transaction.gasPrice).toEqual(ethers.utils.bigNumberify((1000000000)));
  expect(transaction.data).toEqual('0x1');
  expect(transaction.methodName).toEqual(null);
  expect(transaction.methodParams).toEqual([]);
});

test('Test director builder bitcoin tx', async () => {
   const outx = {
    txId: '557bf23415160ce932ea5215e238132bf1cc42c1a7f91846d335d0d1e33cd19f',
    address: BITCOIN_ADDRESS,
    satoshis: 2538851,
    outputIndex: 1
  };
  const builder = new transactions.BitcoinTxBuilder();
  const director = new transactions.TransactionConstructor(builder);
  const transaction = director.buildBitcoinTx(outx, [{address: BITCOIN_ADDRESS, change: true}],
            [{address: BITCOIN_ADDRESS, amount: 0.0001}, {address:BITCOIN_ADDRESS, amount: 0.0002}],
    BITCOIN_ADDRESS);

  const input = structures.BitcoinInput;
  input.address = BITCOIN_ADDRESS;
  input.outputIndex = outx.outputIndex;
  input.satoshis = outx.satoshis;
  input.script = new bitcore.Script(bitcore.Address(BITCOIN_ADDRESS)).toHex();
  input.txId = outx.txId;

  expect(transaction.fee).not.toEqual(0);
  expect(transaction.changeAddress).toEqual(BITCOIN_ADDRESS);
  expect(transaction.inputs[0]).toEqual(input);

});

test('Test director builder multisign bitcoin tx', async () => {
   const outx = {
    txId: '557bf23415160ce932ea5215e238132bf1cc42c1a7f91846d335d0d1e33cd19f',
    address: BITCOIN_ADDRESS,
    satoshis: 2538851,
    outputIndex: 1
  };
  const builder = new transactions.BitcoinTxBuilder();
  const director = new transactions.TransactionConstructor(builder);
  const transaction = director.buildBitcoinTx(outx, [{address: BITCOIN_ADDRESS, change: true}],
    [{address: BITCOIN_ADDRESS, amount: 0.0001}, {address:BITCOIN_ADDRESS, amount: 0.0002}],
    BITCOIN_ADDRESS);

  const input = structures.BitcoinInput;
  input.address = BITCOIN_ADDRESS;
  input.outputIndex = outx.outputIndex;
  input.satoshis = outx.satoshis;
  input.script = new bitcore.Script(bitcore.Address(BITCOIN_ADDRESS)).toHex();
  input.txId = outx.txId;

  expect(transaction.fee).not.toEqual(0);
  expect(transaction.changeAddress).toEqual(BITCOIN_ADDRESS);
  expect(transaction.inputs[0]).toEqual(input);

});
