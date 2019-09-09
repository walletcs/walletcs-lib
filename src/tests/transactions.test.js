const transactions = require('../transactions');
const ethers = require('ethers');
"use strict";

const ETHER_ADDRESS = '0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3';
const BITCOIN_ADDRESS = 'n3rkVDVgppH23BYNyWqULfih1nfesc2t3t';

test('Test create empty unspent EtherTx', async () => {
  const etherTx = new transactions.EtherTx();

  expect(etherTx.to).toEqual('');
  expect(etherTx.from).toEqual('');
  expect(etherTx.value).toEqual(0);
  expect(etherTx.gasPrice).toEqual(0);
  expect(etherTx.gasLimit).toEqual(0);
  expect(etherTx.nonce).toEqual(0);
  expect(etherTx.data).toEqual('0x')

});

test('Test convert to JSON empty unspent EtherTx', async () => {
   const etherTx = new transactions.EtherTx();
   const stringRepr = etherTx.toJSON();
   const expected = JSON.stringify( {
      to: '',
      from: '',
      value: 0,
      gasPrice: 0,
      gasLimit: 0,
      data: '0x',
      nonce: 0
    });

   expect(stringRepr).toEqual(expected);
});

test('Test create unspent BitcoinTx', async () => {
  const bitcoinTx = new transactions.BitcoinTx();

  expect(bitcoinTx.to).toEqual([]);
  expect(bitcoinTx.from).toEqual([]);
  expect(bitcoinTx.amounts).toEqual([]);
  expect(bitcoinTx.changeAddress).toEqual('');
  expect(bitcoinTx.change).toEqual(0);
  expect(bitcoinTx.fee).toEqual(0);
  expect(bitcoinTx.inputs).toEqual([]);
});

test('Test convert to JSON empty unspent BitcoinTx', async () => {
  const bitcoinTx = new transactions.BitcoinTx();
  const stringRepr = bitcoinTx.toJSON();
  const expected = JSON.stringify({
      to: [],
      from: [],
      amounts: [],
      inputs: [],
      change: 0,
      fee: 0,
      changeAddress: ''
  });
  expect(stringRepr).toEqual(expected);
});

test('Test build Ether transaction', async () => {
  const builder = new transactions.EtherTxBuilder('rinkeby');
  builder.setFromAddress(ETHER_ADDRESS);
  builder.setToAddress(ETHER_ADDRESS);
  builder.setAmount(2);
  await builder.setNonce(1);
  await builder.calculateGasPrice();
  await builder.calculateGasLimit();

  const transaction = builder.getResult();

  expect(transaction.nonce).toEqual(1);
  expect(transaction.to).toEqual(ETHER_ADDRESS);
  expect(transaction.from).toEqual(ETHER_ADDRESS);
  expect(transaction.value).toEqual(2);
  expect(transaction.gasLimit).not.toEqual(0);
  expect(transaction.gasPrice).not.toEqual(0);
});

test('Test build Bitcoin transaction', async () => {
  const outx = {
    txId: '557bf23415160ce932ea5215e238132bf1cc42c1a7f91846d335d0d1e33cd19f',
    address: BITCOIN_ADDRESS,
    satoshis: 2538851,
    outputIndex: 1
  };
  const builder = new transactions.BitcoinTxBuilder();
  builder.setFromAddress(BITCOIN_ADDRESS);
  builder.setFromAddress(BITCOIN_ADDRESS);
  builder.setToAddress(BITCOIN_ADDRESS);
  builder.setToAddress(BITCOIN_ADDRESS);
  builder.setAmount(0.0001);
  builder.setAmount(0.0002);
  builder.addChangeAddress(BITCOIN_ADDRESS);
  builder.addOutx(outx);
  builder.calculateFee();

  const transaction = builder.getResult();
  expect(transaction.to[0]).toEqual(BITCOIN_ADDRESS);
  expect(transaction.to[1]).toEqual(BITCOIN_ADDRESS);
  expect(transaction.from[0]).toEqual(BITCOIN_ADDRESS);
  expect(transaction.from[1]).toEqual(BITCOIN_ADDRESS);
  expect(transaction.amounts[0]).toEqual(0.0001 * Math.pow(10, 8));
  expect(transaction.amounts[1]).toEqual(0.0002 * Math.pow(10, 8));
  expect(transaction.changeAddress).toEqual(BITCOIN_ADDRESS);
  expect(transaction.inputs[0].script).not.toEqual(undefined);
  expect(transaction.fee).not.toEqual(0);

});

test('Test build Bitcoin transaction with array params', async () => {
  const outx = {
    txId: '557bf23415160ce932ea5215e238132bf1cc42c1a7f91846d335d0d1e33cd19f',
    address: BITCOIN_ADDRESS,
    satoshis: 2538851,
    outputIndex: 1
  };
  const builder = new transactions.BitcoinTxBuilder();
  builder.setFromAddress([BITCOIN_ADDRESS, BITCOIN_ADDRESS]);
  builder.setToAddress([BITCOIN_ADDRESS, BITCOIN_ADDRESS]);
  builder.setAmount([0.0001, 0.0002]);
  builder.addChangeAddress(BITCOIN_ADDRESS);
  builder.addOutx(outx);
  builder.calculateFee();

  const transaction = builder.getResult();
  expect(transaction.to[0]).toEqual(BITCOIN_ADDRESS);
  expect(transaction.to[1]).toEqual(BITCOIN_ADDRESS);
  expect(transaction.from[0]).toEqual(BITCOIN_ADDRESS);
  expect(transaction.from[1]).toEqual(BITCOIN_ADDRESS);
  expect(transaction.amounts[0]).toEqual(0.0001 * Math.pow(10, 8));
  expect(transaction.amounts[1]).toEqual(0.0002 * Math.pow(10, 8));
  expect(transaction.changeAddress).toEqual(BITCOIN_ADDRESS);
  expect(transaction.inputs[0].script).not.toEqual(undefined);
  expect(transaction.fee).not.toEqual(0);

});

test('Test build Ether contract tx', async () => {
  const builder = new transactions.EtherContractTxBuilder('rinkeby');
  builder.setToAddress(ETHER_ADDRESS);
  builder.setAmount(2);
  builder.setAbi({data: ''});
  builder.setData('0x1');
  await builder.setNonce(1);
  await builder.calculateGasPrice();
  await builder.calculateGasLimit();

  const transaction = builder.getResult();

  expect(transaction.nonce).toEqual(1);
  expect(transaction.to).toEqual(ETHER_ADDRESS);
  expect(transaction.from).toEqual('');
  expect(transaction.value).toEqual(2);
  expect(transaction.gasLimit).not.toEqual(0);
  expect(transaction.gasPrice).not.toEqual(0);
  expect(transaction.abi).toEqual({data: ''});
  expect(transaction.data).toEqual('0x1');
});