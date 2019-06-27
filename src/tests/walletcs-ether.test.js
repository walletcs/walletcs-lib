import {FileTransactionGenerator, FileTransactionReader} from '../walletcs';
import {TransactionBitcoin, BitcoinCheckPair} from '../bitcoin/transactions';
import {ethers} from "ethers";
import {EtherKeyPair} from "../ether/transactions";
import { ConverterCSVToTxObject } from '../utils'

let privateKey = new ethers.utils.SigningKey('F13BD89E70DFC84BF46743A5824AD2CA485C61D998994048510F758CC47E4D6D');
const publicKey = '0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3';

const tx = {
    to: '0X00000000000000000000000000000000000000',
    data: "0x",
    gasLimit: 21000,
    nonce: 0,
    gasPrice: ethers.utils.bigNumberify("20000000000"),
    value: ethers.utils.parseEther("1.0"),
  };
const signedTx = '0x000000000000000000000000000000000000000000000000fffffffffffffffffffffffff';

test('file generate for unsigned tx', async ()=>{
  const contract = '0x0000000000000000000000000000000000001';

  let file = new FileTransactionGenerator();
  file.addTx(contract, tx);

  expect(file.generateJson()).toEqual(JSON.stringify({'transactions': [{'contract': contract, 'transaction': tx}]}))
});

test('file generate for signed tx', async ()=>{
  const contract = '0x0000000000000000000000000000000000001';

  let file = new FileTransactionGenerator();
  file.addTx(contract, signedTx);

  expect(file.generateJson()).toEqual(JSON.stringify({'transactions': [{'contract': contract, 'transaction': signedTx}]}))
});

test('file generate for contract', async () => {
  const contractAddress = '0x000000000000000000000000000000000000f';
  const abi = [{'name': 'test'}];

  let file = new FileTransactionGenerator();
  file.addTx(contractAddress, signedTx);
  file.addContract(contractAddress, abi);
  
  let expectObj = JSON.stringify({'transactions': [{'contract': contractAddress, 'transaction': signedTx}],
    'contracts': [{'contract': contractAddress, 'abi': abi}]});
  expect(file.generateJson()).toEqual(expectObj)
});

test('file reader transaction', async () => {
  const file = {"transactions":[
      {"contract":"0xA2838a2309E487bE7CAD70c955269539dc66d05f",
        "transaction":{"gasPrice": ethers.utils.bigNumberify("20000000000"),
          "gasLimit":1500000,
          "nonce":0,
          "data":"0x23b872dd000000000000000000000000a2838a2309e487be7cad70c955269539dc66d05f000000000000000000000000a2838a2309e487be7cad70c955269539dc66d05f000000000000000000000000000000000000000000000000000000000000000c",
          "to":"0xA2838a2309E487bE7CAD70c955269539dc66d05f"}}],
    "contracts":[{"contract":"0xA2838a2309E487bE7CAD70c955269539dc66d05f","abi":[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","funcName":"name()","signature":"0x06fdde03"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"approve(address,uint256)","signature":"0x095ea7b3"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"index","type":"uint256"},{"name":"lTime","type":"uint256"}],"name":"resetTime","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"resetTime(address,uint256,uint256)","signature":"0x13c27b36"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","funcName":"totalSupply()","signature":"0x18160ddd"},{"constant":false,"inputs":[{"name":"_from","type":"address","value":"0xA2838a2309E487bE7CAD70c955269539dc66d05f"},{"name":"_to","type":"address","value":"0xA2838a2309E487bE7CAD70c955269539dc66d05f"},{"name":"_value","type":"uint256","value":"12"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"transferFrom(address,address,uint256)","signature":"0x23b872dd"},{"constant":false,"inputs":[{"name":"_addresses","type":"address[]"},{"name":"_enable","type":"bool"}],"name":"alwLTBatches","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"alwLTBatches(address[],bool)","signature":"0x2e0bcf85"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","funcName":"decimals()","signature":"0x313ce567"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"lockAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"lockAddress(address)","signature":"0x34a90d02"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"kill()","signature":"0x41c0e1b5"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"isLocked","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","funcName":"isLocked(address)","signature":"0x4a4fbeec"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"lTime","type":"uint256"}],"name":"transferL","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"transferL(address,uint256,uint256)","signature":"0x4c68a070"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"index","type":"uint256"}],"name":"delr","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"delr(address,uint256)","signature":"0x4f7a5ac5"},{"constant":false,"inputs":[{"name":"_addresses","type":"address[]"}],"name":"unlockInBatches","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"unlockInBatches(address[])","signature":"0x5b40d5dd"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"decreaseApproval(address,uint256)","signature":"0x66188463"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","funcName":"balanceOf(address)","signature":"0x70a08231"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"txRecordPerAddress","outputs":[{"name":"amount","type":"uint256"},{"name":"releaseTime","type":"uint256"},{"name":"nextIdx","type":"uint256"},{"name":"prevIdx","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","funcName":"txRecordPerAddress(address,uint256)","signature":"0x73cf3134"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"chainStartIdxPerAddress","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","funcName":"chainStartIdxPerAddress(address)","signature":"0x781e37aa"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","funcName":"isOwner()","signature":"0x8f32d59b"},{"constant":true,"inputs":[],"name":"isLocker","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","funcName":"isLocker()","signature":"0x9006aed1"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","funcName":"symbol()","signature":"0x95d89b41"},{"constant":true,"inputs":[],"name":"TOKEN_UNIT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","funcName":"TOKEN_UNIT()","signature":"0xa5c9cd82"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"transfer(address,uint256)","signature":"0xa9059cbb"},{"constant":false,"inputs":[{"name":"_newLocker","type":"address"}],"name":"transferLocker","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"transferLocker(address)","signature":"0xaa736f57"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_enable","type":"bool"}],"name":"alwLT","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"alwLT(address,bool)","signature":"0xac8f440a"},{"constant":false,"inputs":[{"name":"_addresses","type":"address[]"}],"name":"lockInBatches","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"lockInBatches(address[])","signature":"0xb0759c3e"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"unlockAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"unlockAddress(address)","signature":"0xb7eb5e0a"},{"constant":true,"inputs":[{"name":"addr","type":"address"},{"name":"index","type":"uint256"}],"name":"getRecordInfo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","funcName":"getRecordInfo(address,uint256)","signature":"0xb89c3ec1"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"locked","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","funcName":"locked(address)","signature":"0xcbf9fe5f"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"chainEndIdxPerAddress","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","funcName":"chainEndIdxPerAddress(address)","signature":"0xcf7a91d2"},{"constant":true,"inputs":[],"name":"MAX_BATCH_SIZE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","funcName":"MAX_BATCH_SIZE()","signature":"0xcfdbf254"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"increaseApproval(address,uint256)","signature":"0xd73dd623"},{"constant":true,"inputs":[],"name":"locker","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","funcName":"locker()","signature":"0xd7b96d4e"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"alwLockTx","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","funcName":"alwLockTx(address)","signature":"0xd8220ebe"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","funcName":"allowance(address,address)","signature":"0xdd62ed3e"},{"constant":true,"inputs":[],"name":"MAX_TOKEN_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","funcName":"MAX_TOKEN_SUPPLY()","signature":"0xe489d510"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","funcName":"transferOwnership(address)","signature":"0xf2fde38b"},{"constant":true,"inputs":[{"name":"add","type":"address"}],"name":"txRecordCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","funcName":"txRecordCount(address)","signature":"0xf60b798a"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"}],"name":"Lock","type":"event","funcName":"Lock(address)","signature":"0xc1b5f12cea7c200ad495a43bf2d4c7ba1a753343c06c339093937849de84d913"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"}],"name":"Unlock","type":"event","funcName":"Unlock(address)","signature":"0x0be774851955c26a1d6a32b13b020663a069006b4a3b643ff0b809d318260572"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Assign","type":"event","funcName":"Assign(address,uint256)","signature":"0x8a0e37b73a0d9c82e205d4d1a3ff3d0b57ce5f4d7bccf6bac03336dc101cb7ba"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousLocker","type":"address"},{"indexed":true,"name":"newLocker","type":"address"}],"name":"LockerTransferred","type":"event","funcName":"LockerTransferred(address,address)","signature":"0xb6a14cb7d716300f94e7de6bf44958c82a682b2aec5d25919186fa6109518110"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event","funcName":"OwnershipTransferred(address,address)","signature":"0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event","funcName":"Approval(address,address,uint256)","signature":"0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event","funcName":"Transfer(address,address,uint256)","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"}]}]};
  let wallet = new ethers.Wallet(privateKey);
  file.transactions[0].transaction = await wallet.sign(file.transactions[0].transaction);
  let ftr = new FileTransactionReader(JSON.stringify(file));
  ftr.parserFile()
});

test('file bitcoin reader transaction', async () => {
  let network = 'test3';
  let [address, privateKey] = BitcoinCheckPair.generatePair(network) ;
  const file = {"pub_key":address,"transactions":[{
    "contract":null,
      "transaction":{
      "outxs":[{
        "txId":"74ea8f331e84178096c69a8ded12bbe32572de309f69ccbbe9442eda97898d0b",
        "vout":0}],
        "from":address,
        "amount":100000,
        "to":"mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X",
        "attempt_spent":9236254,
        "change": 9236254 - 10000,
        "type": "single"}}]};
  file.transactions[0].transaction = TransactionBitcoin.sign(privateKey, file.transactions[0].transaction, network);
  let ftr = new FileTransactionReader(JSON.stringify(file));
  ftr.parserFile(true)
});

test('Convert csv to json', async () => {
  let network = 'rinkeby';
  let [address, privateKey] = EtherKeyPair.generatePair(network);
  let [address2, privateKey2] = EtherKeyPair.generatePair(network);

  const rows = [
    [address, 0.001],
    [address2, 0.0001]
  ];
  
  let csvContent = ""
      + rows.map(e => e.join(",")).join("\n");
  
  let parser = new ConverterCSVToTxObject(csvContent, publicKey, network);
  let jsonFile = await parser.convert();
  expect(jsonFile[0].to).toEqual(address);
  expect(jsonFile[1].to).toEqual(address2);
  expect(jsonFile[0].from).toEqual(publicKey);
  expect(jsonFile[1].from).toEqual(publicKey);
  expect(jsonFile[0].gasLimit).toEqual(21000);
  expect(jsonFile[1].gasLimit).toEqual(21000);
});
