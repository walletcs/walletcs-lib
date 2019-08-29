import Web3 from 'web3';
import {ethers, utils} from 'ethers';
import {EtherTransaction, EtherTransactionDecoder, EtherWallet, representEthTx} from '../index';

const abiInterface = [
    {
      "constant": true,
      "inputs": [],
      "name": "mintingFinished",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "PausableNonce",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "sigV",
          "type": "uint8[]"
        },
        {
          "name": "sigR",
          "type": "bytes32[]"
        },
        {
          "name": "sigS",
          "type": "bytes32[]"
        }
      ],
      "name": "unpause",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "sigV",
          "type": "uint8[]"
        },
        {
          "name": "sigR",
          "type": "bytes32[]"
        },
        {
          "name": "sigS",
          "type": "bytes32[]"
        }
      ],
      "name": "pause",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "burnFrom",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_foundersMultisig",
          "type": "address"
        },
        {
          "name": "_allowTransfersWhenPause",
          "type": "address[]"
        },
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "MintFinished",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "recipients",
          "type": "address[]"
        },
        {
          "name": "values",
          "type": "uint256[]"
        }
      ],
      "name": "airdrop",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "finishMinting",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

const tokenAddress = '0xa248f0e25d30fa2df995753afc2bcb2d0f3697ec';


let web3 = new Web3('http://127.0.0.1:7545');
let provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545');
let privateKey = new ethers.utils.SigningKey('f13bd89e70dfc84bf46743a5824ad2ca485c61d998994048510f758cc47e4d6d');
let wallet = new ethers.Wallet(privateKey, provider);

async function createTx () {
  let accounsts = await provider.listAccounts();

  const tx = {
    to: accounsts[1],
    data: "0x",
    gasLimit: 21000,
    nonce: await wallet.getTransactionCount(),
    gasPrice: ethers.utils.bigNumberify("20000000000"),
    value: ethers.utils.parseEther("1.0"),
  };

  return tx
}

async function createTokenTx(){
  let accounsts = await provider.listAccounts();
  let contract = new web3.eth.Contract(abiInterface, tokenAddress);
  let amount = 1;
  let to = accounsts[1];

  const tx = {
    to: tokenAddress,
    gasLimit: 21000,
    nonce: await wallet.getTransactionCount(),
    gasPrice: ethers.utils.bigNumberify("20000000000"),
    data: contract.methods.transfer(to, amount).encodeABI()
  };

  return await wallet.sign(tx);
}

async function createTransfer(){
  return  {"gasLimit":21000,"gasPrice": {"_hex":"0x3b9aca00"},"nonce":33,"to":"0x74930Ad53AE8E4CfBC3FD3FE36920a3BA54dd7E3","value": {"_hex":"0x0de0b6b3a7640000"},"data":"0x"};
}

test('test restore data form ethereum tx', async () => {
  let tx = await createTx();
  rawTx = await wallet.sign(tx);
  let txConvert = new EtherTransactionDecoder(rawTx);
  txConvert.decode();
  let rawTx = txConvert.getTransaction();
  expect(rawTx.value).toEqual("1.0");
  expect(rawTx.gasLimit).toEqual(21000);
  expect(rawTx.data).toEqual('0x');
});

test('test restore data from token tx', async () => {
  let tx = await createTokenTx();
  let txConvert = new EtherTransactionDecoder(tx);
  txConvert.addABI(abiInterface);
  txConvert.decode();
  const rawTx = txConvert.getTransaction();
  expect(rawTx.value).toEqual("0.0");
  expect(rawTx.gasLimit).toEqual(21000);
  expect(rawTx.data['name']).toEqual('transfer')
});

test('test create pair keys', async () => {
  let keysPair = EtherWallet.generatePair();
  expect(keysPair[0]).not.toBeUndefined();
  expect(keysPair[0]).not.toBeUndefined();
});

test('test check private key and public key', async () =>{
  let keysPair = EtherWallet.generatePair();
  let keysPair2 = EtherWallet.generatePair();

  expect(EtherWallet.checkPair(keysPair[0], keysPair[1])).toBeTruthy();
  expect(EtherWallet.checkPair(keysPair[0], keysPair2[1])).toBeFalsy();
});

test('test recover public key', async () => {
  let keysPair = EtherWallet.generatePair();
  let recovered = EtherWallet.recoveryPublicKey(keysPair[1]);

  expect(keysPair[0]).toEqual(recovered)
});

test('test check correct transaction', async () => {
  let tx = await createTx();
  expect(EtherTransaction.checkCorrectTx(tx)).toBeTruthy();
});

test('test check not correct transaction', async () => {
  let tx = await createTx();

  delete tx['data'];

  expect(EtherTransaction.checkCorrectTx(tx)).toBeFalsy();
});

test('test sign transfer', async () => {
  try {
    const tx = await createTransfer();
    const signTx = await  EtherTransaction.sign('c304a1266482d6ffefc2d1b67f58a8ff3a0a8c922d96d21cf67ce5ff7278c00e', tx);
    expect.stringContaining(signTx)
  } catch(e) {
    console.log(e);
  }
});

test('test represent tx', async () => {
  let tx = await createTransfer();
  let newTx = representEthTx(tx);

  expect(newTx.value).toEqual('1.0');
});

test('Test create pair keys from mnemonic',  async () => {
  const addresses = await EtherWallet.fromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
    expect(addresses[0]).toEqual('xpub661MyMwAqRbcG42Nchfke9KUhfnD4BZKko2XrrPTCXaVmZNS9D7AGHFEEpVMF2ddCiRHxY4DGJVyHDsc69qS2Z8c4YCzKbgSpAcpAtuzGKb');
    expect(addresses[1]).toEqual('xprv9s21ZrQH143K3ZwuWg8kH1Nk9dwieiqUPa6w4TyqeC3Wtm3HbfnuiUvkPZMx6WcYAMcLphQJnnkautdLoVZmPiXunLdu5jqKPUwK6YDwxb6');

});

test('Test generate mnemonic', async () => {
  const mnemonic = EtherWallet.generateMnemonic();
  expect(mnemonic).toBeTruthy()
});

test('Test validation mnemonic', async () => {
  const mnemonic = EtherWallet.generateMnemonic();
  expect(EtherWallet.validateMnemonic(mnemonic)).toBeTruthy()
});

test('Test get number account from xpub', async () => {
  const addresses = await EtherWallet.fromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xpub = addresses[0];
  const address = EtherWallet.getAddressFromXpub(xpub);
  expect(address).toEqual('0x343E60ACea58388fCba2C21F302312feCf55175A')
});

test('Test get number account from xprv', async () => {
  const addresses = await EtherWallet.fromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses[1];
  const child1 = EtherWallet.getAddressWithPrivateFromXprv(xprv, 0);

  expect(child1[0]).toEqual('0x343E60ACea58388fCba2C21F302312feCf55175A')
  expect(child1[1]).toEqual('0x51778a8e47592afeaa55ca845cf27a4a8f996f9590d2694eac9b9fb2b5efd40a')
});
