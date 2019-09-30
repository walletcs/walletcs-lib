const parsers = require('../parsers');
const structures = require('../base/structures');
const errors = require('../base/errors');
const ethers = require('ethers');
const _ = require('lodash');

const bitcoinFileTx = { "outx":[{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":2,"address":"mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X","satoshis":8847983},{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":1,"address":"mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X","satoshis":20000},{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":0,"address":"mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X","satoshis":10000}],"from":[{"address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X",  "change": false}],"to":[{"address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X", "amount": 0.0001}, { "address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X", "amount": 0.00011}], "fee": 0};
const etherFileTx = {"transactions":[{"gasLimit":21000,"gasPrice":{"_hex":"0x3b9aca00"},"nonce":32,"to": {"address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3", "amount": 1}, "from": {"address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3", "change": true}, "data":"0x"}],"contracts":[]};
const etherContractFileTx = {"transactions":[{"gasLimit":21000,"gasPrice":{"_hex":"0x3b9aca00"},"nonce":32, "to": {"address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3"}, "from": {"address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3"}, "data":"0x1" }],"contracts":[{'address': '0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3', 'abi': []}]};
const mixedEtherFileTx = {"transactions":[{"gasLimit":21000,"gasPrice":{"_hex":"0x3b9aca00"},"nonce":32,"to":[{"address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3", "amount": 10000}], "from": [{"address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3"}], "data":"0x"}, {"gasLimit":21000,"gasPrice":{"_hex":"0x3b9aca00"},"nonce":32,"to":[{"address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3"}], "from": [{"address": "0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3"}], "data":"0x1" }],"contracts":[{'address': '0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3', 'abi': []}]};

test('Test parser bitcoin file tx', async () => {
  const result = parsers.JSONParser.parseFile(JSON.stringify(bitcoinFileTx));
  expect(result[0].to).toEqual([{"address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X", "satoshis": 10000 }, {"address": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X", "satoshis": 11000}]);
  expect(result[0].from).toEqual([ 'mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X' ]);
  expect(Object.keys(result[0].inputs[0]).sort()).toEqual(Object.keys(structures.BitcoinInput).sort());
  expect(result[0].changeAddress).toEqual('');
  expect(result[0].fee).not.toEqual(0);
});

test('Test parser ether file tx', async() => {
  const result = parsers.JSONParser.parseFile(JSON.stringify(etherFileTx));

  expect(result[0].to).toEqual('0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3');
  expect(result[0].value).toEqual(ethers.utils.parseEther('1'));
  expect(result[0].gasLimit).toEqual(ethers.utils.bigNumberify(21000));
  expect(result[0].gasPrice).toEqual(ethers.utils.bigNumberify({"_hex":"0x3b9aca00"}));
  expect(result[0].nonce).toEqual(32);
  expect(result[0].data).toEqual('0x');
});

test('Test parser ether contract file tx', async() => {
  const result = parsers.JSONParser.parseFile(JSON.stringify(etherContractFileTx));

  expect(result[0].to).toEqual('0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3');
  expect(result[0].gasLimit).toEqual(ethers.utils.bigNumberify(21000));
  expect(result[0].gasPrice).toEqual(ethers.utils.bigNumberify({"_hex":"0x3b9aca00"}));
  expect(result[0].nonce).toEqual(32);
  expect(result[0].data).toEqual('0x1');
});

test('Test parser ether mixed file', async() => {
  const result = parsers.JSONParser.parseFile(JSON.stringify(mixedEtherFileTx));

  expect(result[1].to).toEqual('0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3');
  expect(result[1].gasLimit).toEqual(ethers.utils.bigNumberify(21000));
  expect(result[1].gasPrice).toEqual(ethers.utils.bigNumberify({"_hex":"0x3b9aca00"}));
  expect(result[1].nonce).toEqual(32);
  expect(result[1].data).toEqual('0x1');

  expect(result[0].to).toEqual('0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3');
  expect(result[0].value).toEqual(ethers.utils.parseEther('10000'));
  expect(result[0].gasLimit).toEqual(ethers.utils.bigNumberify(21000));
  expect(result[0].gasPrice).toEqual(ethers.utils.bigNumberify({"_hex":"0x3b9aca00"}));
  expect(result[0].nonce).toEqual(32);
  expect(result[0].data).toEqual('0x');
});

test('Test for empty file', async () => {
  expect(() => {
      parsers.JSONParser.parseFile('');
  }).toThrowError(errors.PARSING_ERROR);
  expect(parsers.JSONParser.getType('')).toEqual('unknown');
});

test('Test parsing not filled ether file out ', async () => {
  const emptyEtherFile = {"transactions":[],"contracts":[]};
  const result = parsers.JSONParser.parseFile(JSON.stringify(emptyEtherFile));
  const typeFile = parsers.JSONParser.getType(JSON.stringify(emptyEtherFile));
  expect(_.isArray(result)).toBeTruthy();
  expect(result.length).toEqual(0);
  expect(typeFile).toEqual('ETHFileTx');
});

test('Test parsing not filled bitcoin file out', async ()=> {
  const emptyBitcoinFileTx = {"outx":[],"from":[],"to":[], "fee": null};
  const result = parsers.JSONParser.parseFile(JSON.stringify(emptyBitcoinFileTx));
  const typeFile = parsers.JSONParser.getType(JSON.stringify(emptyBitcoinFileTx));
  expect(_.isArray(result)).toBeTruthy();
  expect(result.length).toEqual(0);
  expect(typeFile).toEqual('BTCFileTx');
});
