import {
  BitcoinCheckPair,
  BitcoinTransaction,
  checkBitcoinAdress,
} from '../index.js';
import mockAxios from "axios";

const mockResponse = {
  "address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X",
  "total_received": 9236254,
  "total_sent": 358271,
  "balance": 8877983,
  "unconfirmed_balance": 0,
  "final_balance": 8877983,
  "n_tx": 17,
  "unconfirmed_n_tx": 0,
  "final_n_tx": 17,
  "txrefs": [
    {
      "tx_hash": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
      "block_height": 1518871,
      "tx_input_n": -1,
      "tx_output_n": 2,
      "value": 8847983,
      "ref_balance": 17784760,
      "spent": false,
      "confirmations": 55522,
      "confirmed": "2019-05-29T11:41:46Z",
      "double_spend": false
    },
    {
      "tx_hash": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
      "block_height": 1518871,
      "tx_input_n": -1,
      "tx_output_n": 1,
      "value": 20000,
      "ref_balance": 8936777,
      "spent": false,
      "confirmations": 55522,
      "confirmed": "2019-05-29T11:41:46Z",
      "double_spend": false
    },
    {
      "tx_hash": "191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072",
      "block_height": 1518871,
      "tx_input_n": -1,
      "tx_output_n": 0,
      "value": 10000,
      "ref_balance": 8916777,
      "spent": false,
      "confirmations": 55522,
      "confirmed": "2019-05-29T11:41:46Z",
      "double_spend": false
    }
  ],
  "tx_url": "https://api.blockcypher.com/v1/btc/test3/txs/"
};

const mockResponse2 = {
  "address": "n3rkVDVgppH23BYNyWqULfih1nfesc2t3t",
  "total_received": 2538851,
  "total_sent": 0,
  "balance": 2538851,
  "unconfirmed_balance": 0,
  "final_balance": 2538851,
  "n_tx": 1,
  "unconfirmed_n_tx": 0,
  "final_n_tx": 1,
  "txrefs": [
    {
      "tx_hash": "557bf23415160ce932ea5215e238132bf1cc42c1a7f91846d335d0d1e33cd19f",
      "block_height": 1574426,
      "tx_input_n": -1,
      "tx_output_n": 1,
      "value": 2538851,
      "ref_balance": 2538851,
      "spent": false,
      "confirmations": 57,
      "confirmed": "2019-08-14T06:26:03Z",
      "double_spend": false
    }
  ],
  "tx_url": "https://api.blockcypher.com/v1/btc/test3/txs/"
};

let network = 'test3';
let address = 'mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X';
let address2 = 'n3rkVDVgppH23BYNyWqULfih1nfesc2t3t';
let privateKey = '93Fd7g7K2iduaVBnK8RxksxSLyCwiwiJ6r9juTQTckAdYCH3irD';
let privateKey2 = '9214VRDLwvXj31dFRWpdLR8JXyMsDuf8EpBE3cS6yFqx1MyCj5G';


test('Test create transaction', async() => {
  mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockResponse }));
  let bitTx = new BitcoinTransaction(network);
  await bitTx.createTx(
    [address],
    [address, address],
    [0.0001, 0.00001],
    address,
    0.02,
    'single');
  const rawTx = bitTx.getJsonTransaction();
  expect(rawTx).toEqual('{"outxs":[{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072"' +
    ',"outputIndex":2,"address":"mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X","satoshis":8847983,"script":"76a914009ec' +
    '2f79b3d929880731e811c4470c596ba6f0488ac"}],"to":["mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X","mfaEV17ReZSubrJ8o' +
    'hPWB5PQqPiLMgc47X"],"amounts":[10000,1000],"changeAddress":"mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X","fee":2000000,"type":"single"}')

});

test('Test single sing transaction', async() => {
  mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockResponse }));
  let bitTx = new BitcoinTransaction(network);
  await bitTx.createTx(
    [address],
    [address, address],
    [0.0001, 0.00001],
    address,
    0.02,
    'single');
  bitTx.sign(privateKey);
  expect(bitTx._transaction.isFullySigned()).toEqual(true);
});

test('Test single sing transaction get signature', async() => {
  mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockResponse }));
  let bitTx = new BitcoinTransaction(network);
  await bitTx.createTx(
    [address],
    [address, address],
    [0.0001, 0.00001],
    address,
    0.02,
    'single');
  bitTx.sign(privateKey);
  expect(bitTx.getRawTransaction()).toEqual('0100000001722023b4e1708c89b9ebe19f6506311240b8cd8f2b32f77a0f58da3a' +
    'fe121d19020000008b483045022100a3bad10781ce0f6c27900b620d72d4776685c8f1d64bc68def62f5981fff7adb022046783ad9' +
    'ca0438ecfc3b39f77522ac4eec6f305c65fa5c96c61784b2fa3ec668014104b3d55dd74c7d8c84acfb7b1175e4f77b3b3b9d6e3c82' +
    'f35828da3710fd801b571df6e735df3d17c18b10c213212a9205c76430b29ab5c0ccb983b7b804b4ad3dffffffff03102700000000' +
    '00001976a914009ec2f79b3d929880731e811c4470c596ba6f0488ace8030000000000001976a914009ec2f79b3d929880731e811c' +
    '4470c596ba6f0488acf7526800000000001976a914009ec2f79b3d929880731e811c4470c596ba6f0488ac00000000');
});

test('Test multisign transaction', async() => {
  mockAxios.get
    .mockImplementationOnce(() => Promise.resolve({ data: mockResponse }))
    .mockImplementationOnce(() => Promise.resolve({ data: mockResponse2 }));
  let bitTx = new BitcoinTransaction(network);
  await bitTx.createTx(
    [address, address2],
    [address, address],
    [0.1, 0.00001],
    address,
    null,
    'single');
  bitTx.sign([privateKey, privateKey2]);
  expect(bitTx._transaction.isFullySigned()).toEqual(true);
  expect(bitTx.getRawTransaction()).toEqual('0100000004722023b4e1708c89b9ebe19f6506311240b8cd8f2b32f77a0f58da3a' +
    'fe121d19020000008b48304502210097b435b77131c12e323a97f5b2cfcbbd5643b66893a855de916b53a72ae117420220495348b9' +
    'a485e39b89f84074c48ad119f6f42639788c6da9322b7413d48381c4014104b3d55dd74c7d8c84acfb7b1175e4f77b3b3b9d6e3c82' +
    'f35828da3710fd801b571df6e735df3d17c18b10c213212a9205c76430b29ab5c0ccb983b7b804b4ad3dffffffff722023b4e1708c' +
    '89b9ebe19f6506311240b8cd8f2b32f77a0f58da3afe121d19010000008b483045022100f3441b82a66029b9030826ba0ce25e7aad' +
    'd25b9922923b641fe41ae0784bd5950220251132c1be6608ef0d3e71e108e8c9b9e2951c893552d2e8eb8df44c0b28a9dc014104b3' +
    'd55dd74c7d8c84acfb7b1175e4f77b3b3b9d6e3c82f35828da3710fd801b571df6e735df3d17c18b10c213212a9205c76430b29ab5' +
    'c0ccb983b7b804b4ad3dffffffff722023b4e1708c89b9ebe19f6506311240b8cd8f2b32f77a0f58da3afe121d19000000008a4730' +
    '4402205602bccc1e6e5d381bb2ffd050fe6e01e1c6b1e5ec2bdca5893ea8f2fbfaa4420220048f9c1f9850f971eb3c2c8f78b69d9f' +
    'bcf21eb6bcb19c4a78fdcd7c252ee878014104b3d55dd74c7d8c84acfb7b1175e4f77b3b3b9d6e3c82f35828da3710fd801b571df6' +
    'e735df3d17c18b10c213212a9205c76430b29ab5c0ccb983b7b804b4ad3dffffffff9fd13ce3d1d035d34618f9a7c142ccf12b1338' +
    'e21552ea32e90c161534f27b55010000008a4730440220196724b295c385bb1936746ab8bfc0bf966f0ece2dd365014daa6f7b793a' +
    '689e022073dbbc9fb5739bb57bd730da290bb679efadcae33f5fab4772b160c9d27cfb8901410433a751b7f5e45921ce98eac39420' +
    'c7565e6343bf2e0c521b843e316ffe7f9ef02bfd4603705d3751b64e7647b14ace6f8379b1f283c11f796919fcd09de0207effffff' +
    'ff0380969800000000001976a914009ec2f79b3d929880731e811c4470c596ba6f0488ace8030000000000001976a914009ec2f79b' +
    '3d929880731e811c4470c596ba6f0488acba0f1500000000001976a914009ec2f79b3d929880731e811c4470c596ba6f0488ac00000000')
});

test('Test transaction throw too low balance.', async () => {
  mockAxios.get
    .mockImplementationOnce(() => Promise.resolve({ data: mockResponse }));
  let bitTx = new BitcoinTransaction(network);
  await expect(bitTx.createTx(
    [address, address2],
    [address, address],
    [1, 0.00001],
    address,
    null,
    'single')).rejects.toThrow('Too low balance.');
});

test('Test multisign transaction throw too low balance.', async () => {
  mockAxios.get
    .mockImplementationOnce(() => Promise.resolve({ data: mockResponse }))
    .mockImplementationOnce(() => Promise.resolve({ data: mockResponse2 }));
  let bitTx = new BitcoinTransaction(network);
  await expect(bitTx.createTx(
    [address, address2],
    [address, address],
    [1, 0.00001], address,
    null,
    'single')).rejects.toThrow('Too low balance.');
});

test('Test check address bitcoin', async () => {
  expect(checkBitcoinAdress(address)).toBeTruthy()
});

test('Test generate pair name', async () => {
  let [address, key] = BitcoinCheckPair.generatePair('test3');
  expect(checkBitcoinAdress(address)).toBeTruthy();
  expect.stringContaining(key)
});

test('Test recovery public key', async () => {
  let [address, key] = BitcoinCheckPair.generatePair('test3');
  let recovered_address = BitcoinCheckPair.recoveryPublicKey(key, 'test3');

  expect(address).toEqual(recovered_address);
});

test('Test check address', async () => {
  let [address, key] = BitcoinCheckPair.generatePair('test3');

  expect(BitcoinCheckPair.checkPair(address, key, network)).toBeTruthy()
});

test('Test convert to satoshi', async () => {
  mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockResponse }));
  let bitTx = new BitcoinTransaction(network);
  await bitTx.createTx(
    [address, address2],
    [address, address],
    [0.00001, 0.00001],
    address,
    null,
    'single');
  const rawTx = JSON.parse(bitTx.getJsonTransaction());
  expect(rawTx.amounts[0]).toEqual(1000);
  expect(rawTx.amounts[1]).toEqual(1000);
});

test('Test broadcast transaction', async () => {
  mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockResponse }));
  let bitTx = new BitcoinTransaction(network);
  await bitTx.createTx(
    [address],
    [address, address],
    [0.00001, 0.00001],
    address,
    null,
    'single');
  bitTx.sign(privateKey);
  const signature = bitTx.getRawTransaction();
  mockAxios.post.mockImplementationOnce(() => Promise.resolve({ ok: true }));
  const response = await BitcoinTransaction.broadcastTx(signature, network);
  expect(mockAxios.post.mock.calls.length).toEqual(1);
  expect(response.ok).toBeTruthy()
});
