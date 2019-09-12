const parsers = require('../parsers');
const structures = require('../base/structures');
const ethers = require('ethers');
const _ = require('lodash');

const bitcoinFileTx = { "outx":[{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":2,"address":"mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X","satoshis":8847983},{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":1,"address":"mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X","satoshis":20000},{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":0,"address":"mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X","satoshis":10000}],"from":["mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X"],"to":["mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X","mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X"],"amount":[10000,110000], "changeAddress": "mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X", "fee": null};
const etherFileTx = {"pubKey":"0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3","transactions":[{"gasLimit":21000,"gasPrice":{"_hex":"0x3b9aca00"},"nonce":32,"to":"0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3","value":"1","data":"0x"}],"contracts":[]};
const etherContractFileTx = {"pubKey":"0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3","transactions":[{"gasLimit":21000,"gasPrice":{"_hex":"0x3b9aca00"},"nonce":32,"to":"0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3", "data":"0x1" }],"contracts":[{'address': '0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3', 'abi': []}]};
const mixedEtherFileTx = {"pubKey":"0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3","transactions":[{"gasLimit":21000,"gasPrice":{"_hex":"0x3b9aca00"},"nonce":32,"to":"0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3","value":"1","data":"0x"}, {"gasLimit":21000,"gasPrice":{"_hex":"0x3b9aca00"},"nonce":32,"to":"0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3", "data":"0x1" }],"contracts":[{'address': '0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3', 'abi': []}]};

test('Test parser bitcoin file tx', async () => {
  const result = parsers.JSONParser.parseFile(JSON.stringify(bitcoinFileTx));

  expect(result[0].to).toEqual([ 'mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X', 'mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X' ]);
  expect(result[0].from).toEqual([ 'mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X' ]);
  expect(result[0].amounts).toEqual([ 10000, 110000 ]);
  expect(Object.keys(result[0].inputs[0]).sort()).toEqual(Object.keys(structures.BitcoinInput).sort());
  expect(result[0].changeAddress).toEqual('mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X');
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
  expect(result[0].value).toEqual(ethers.utils.parseEther('1'));
  expect(result[0].gasLimit).toEqual(ethers.utils.bigNumberify(21000));
  expect(result[0].gasPrice).toEqual(ethers.utils.bigNumberify({"_hex":"0x3b9aca00"}));
  expect(result[0].nonce).toEqual(32);
  expect(result[0].data).toEqual('0x');
});

test('Test not correct format file', async () => {
  expect(() => {
      parsers.JSONParser.parseFile('');
  }).toThrow()
});

test('Test parse empty ether tx file', async () => {
  const emptyEtherFile = {"pubKey":"","transactions":[],"contracts":[]};
  const result = parsers.JSONParser.parseFile(JSON.stringify(emptyEtherFile));
  const typeFile = parsers.JSONParser.getType(JSON.stringify(emptyEtherFile));
  expect(_.isArray(result)).toBeTruthy();
  expect(result.length).toEqual(0);
  expect(typeFile).toEqual('ETHFileTX');
});

test('Test parse empty bitcoin tx file', async ()=> {
  const emptyBitcoinFileTx = { "outx":[],"from":[],"to":[],"amount":[], "changeAddress": "", "fee": null};
  const result = parsers.JSONParser.parseFile(JSON.stringify(emptyBitcoinFileTx));
  const typeFile = parsers.JSONParser.getType(JSON.stringify(emptyBitcoinFileTx));
  expect(_.isArray(result)).toBeTruthy();
  expect(result.length).toEqual(0);
  expect(typeFile).toEqual('BTCFileTX');

});