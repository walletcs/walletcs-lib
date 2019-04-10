import bitcoin from 'bitcoinjs-lib';
import {TransactionBitcoin} from '../transactions';
import {ethers} from "ethers";

let network = 'test3';
let address = 'mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X';
let privateKey = '93Fd7g7K2iduaVBnK8RxksxSLyCwiwiJ6r9juTQTckAdYCH3irD';

test('Test create transaction', async() => {
  let bitTx = new TransactionBitcoin(address, network);
  let rawTx = await bitTx.createTx(1000, address);
  expect.arrayContaining(rawTx.outxs)
});

test('Test sing transaction', async() => {
  let bitTx = new TransactionBitcoin(address, network);
  let rawTx = await bitTx.createTx(1000, address);
  
  let signature = TransactionBitcoin.sign(privateKey, rawTx);
  expect(signature).toEqual('02000000010b8d8997da2e44e9bbcc699f30de7225e3bb12ed8d9ac6968017841e338fea74000000008b4830450221009468e82af14ef9e913f938ba947f28c49b76868572c4b7360efa29292147ac4e02203c8973ed60b3515ca1477baa3b80118718696f487a68e9c9c3417f358b07e756014104b3d55dd74c7d8c84acfb7b1175e4f77b3b3b9d6e3c82f35828da3710fd801b571df6e735df3d17c18b10c213212a9205c76430b29ab5c0ccb983b7b804b4ad3dffffffff01e8030000000000001976a914009ec2f79b3d929880731e811c4470c596ba6f0488ac00000000');
});

test('Test send transaction', async () => {
  let bitTx = new TransactionBitcoin(address, network);
  let rawTx = await bitTx.createTx(1000, address);
  
  let signature = TransactionBitcoin.sign(privateKey, rawTx);
  
  let result = await bitTx.broadcastTx(signature);
  console.log(result);
  expect(result.total).toEqual(4988000)
});
