const transactions = require('../transactions');

"use strict";

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