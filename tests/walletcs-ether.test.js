import {FileGenerator, KeyChecker} from '../src/walletcs-ether';
import {ethers} from "ethers";

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
  const pub = '0x0000000000000000000000000000000000001';

  let file = new FileGenerator();
  file.addTx(pub, tx);

  expect(file.generateJson()).toEqual(JSON.stringify({'transactions': [{'pub_key': pub, 'transaction': tx}]}))
});

test('file generate for signed tx', async ()=>{
  const pub = '0x0000000000000000000000000000000000001';

  let file = new FileGenerator();
  file.addTx(pub, signedTx);

  expect(file.generateJson()).toEqual(JSON.stringify({'transactions': [{'pub_key': pub, 'transaction': signedTx}]}))
});

test('file generate for contract', async () => {
  const pub = '0x0000000000000000000000000000000000001';
  const contractAddress = '0x000000000000000000000000000000000000f';
  const abi = [{'name': 'test'}];

  let file = new FileGenerator();
  file.addTx(pub, signedTx);
  file.addContract(contractAddress, abi);

  expect(file.generateJson()).toEqual(JSON.stringify({'transactions': [{'pub_key': pub, 'transaction': signedTx}],
    'contracts': [{'contract': contractAddress, 'abi': abi}]}))
});
