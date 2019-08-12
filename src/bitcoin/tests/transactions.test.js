import {BitcoinCheckPair, checkBitcoinAdress, TransactionBitcoin} from '../transactions';

let network = 'test3';
let address = 'mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X';
let privateKey = '93Fd7g7K2iduaVBnK8RxksxSLyCwiwiJ6r9juTQTckAdYCH3irD';

test('Test create transaction', async() => {
  let bitTx = new TransactionBitcoin([address], network);
  let rawTx = await bitTx.createTx([address], 1000);
  expect.arrayContaining(rawTx.assetTo);
  expect.arrayContaining(rawTx.assetUnspentTx);

});
//
// test('Test sing transaction', async() => {
//   let bitTx = new TransactionBitcoin(address, network);
//   let rawTx = await bitTx.createTx(1000, address);
//
//   let signature = TransactionBitcoin.sign(privateKey, rawTx, network);
//   expect.stringContaining(signature);
// });
//
// test('Test broadcast transaction', async () => {
//   let bitTx = new TransactionBitcoin(address, network);
//   let rawTx = await bitTx.createTx(1000, address);
//
//   let signature = TransactionBitcoin.sign(privateKey, rawTx, network);
//   let result = await TransactionBitcoin.broadcastTx(signature, network);
//   expect.arrayContaining(result.txrefs)
// });
//
// test('Test check address bitcoin', async () => {
//   expect(checkBitcoinAdress(address)).toEqual(true)
// });
//
// test('Test generate pair name', async () => {
//   let [address, key] = BitcoinCheckPair.generatePair('test3');
//   expect(checkBitcoinAdress(address)).toEqual(true);
//   expect.stringContaining(key)
// });
//
// test('Test recovery public key', async () => {
//   let [address, key] = BitcoinCheckPair.generatePair('test3');
//   let recovered_address = BitcoinCheckPair.recoveryPublicKey(key, 'test3');
//
//   expect(address).toEqual(recovered_address);
// });
//
// test('Test check address', async () => {
//   let [address, key] = BitcoinCheckPair.generatePair('test3');
//
//   expect(BitcoinCheckPair.checkPair(address, key, network)).toBeTruthy()
// });
//
// test('Test create batch transactions', async () => {
//   let bitTx = new TransactionBitcoin(address, network);
//   let rawTx = await bitTx.createTx([1000,1000], [address, address], null, true);
//   expect.arrayContaining(rawTx.outxs);
//   expect.arrayContaining(rawTx.to);
//   expect.arrayContaining(rawTx.amount);
//   expect(rawTx.type).toEqual('batch');
// });
//
// test('Test sign batch transactions', async () => {
//   let bitTx = new TransactionBitcoin(address, network);
//
//   let rawTx = await bitTx.createTx([1000, 1000], [address, address], null, true);
//   let signature = await TransactionBitcoin.sign(privateKey, rawTx, network);
//   console.log(signature);
//   expect.stringContaining(signature);
// });
//
// test('Test broadcast batch transactions', async () => {
//   let bitTx = new TransactionBitcoin(address, network);
//
//   let rawTx = await bitTx.createTx([1000, 1000], [address, address], null, true);
//   let signature = await TransactionBitcoin.sign(privateKey, rawTx, network);
//   TransactionBitcoin.broadcastTx(signature, network);
//   try {
//     let result = await TransactionBitcoin.broadcastTx(signature, network);
//     expect.arrayContaining(result.txrefs);
//     console.log(result.data)
//   } catch (e) {
//     console.log(e);
//   }
// }, 10000);
//
// test('Test convert to satoshi', async () => {
//   let bitTx = new TransactionBitcoin(address, network);
//
//   let rawTx = await bitTx.createTx(['0.0001', '0.0001'], [address, address], null, true);
//   expect(rawTx.amount[0]).toEqual(10000);
//   expect(rawTx.amount[1]).toEqual(10000);
// });
