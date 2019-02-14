import Web3 from 'web3';
import {ethers} from 'ethers';
import {EtherTransaction, EtherTransactionDecoder, EtherKeyPair} from '../ether/transactions';

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
  let contract = web3.eth.Contract(abiInterface, tokenAddress);
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

test('test restore data form ethereum tx', async () => {
  let tx = await createTx();
  rawTx = await wallet.sign(tx);
  let txConvert = new EtherTransactionDecoder(rawTx);
  let rawTx = txConvert.decodeTx();
  expect(rawTx.value).toEqual(ethers.utils.parseEther("1.0"));
  expect(rawTx.gasLimit).toEqual(21000);
  expect(rawTx.data).toEqual('0x');
});

test('test restore data from token tx', async () => {
  let tx = await createTokenTx();
  let txConvert = new EtherTransactionDecoder(tx);
  txConvert.addABI(abiInterface);
  let rawTx = txConvert.decodeTx();
  expect(rawTx.value).toEqual(ethers.utils.bigNumberify("0x00"));
  expect(rawTx.gasLimit).toEqual(21000);
  expect(rawTx.data['name']).toEqual('transfer')
});

test('test create pair keys', async () => {
  let keysPair = EtherKeyPair.generatePair();
  expect(keysPair.privateKey).not.toBeUndefined();
  expect(keysPair.address).not.toBeUndefined();
});

test('test check private key and public key', async () =>{
  let keysPair = EtherKeyPair.generatePair();
  let keysPair2 = EtherKeyPair.generatePair();

  expect(EtherKeyPair.checkPair(keysPair.address, keysPair.privateKey)).toBeTruthy();
  expect(EtherKeyPair.checkPair(keysPair.address, keysPair2.privateKey)).toBeFalsy();
});

test('test recover public key', async () => {
  let keysPair = EtherKeyPair.generatePair();
  let recovered = EtherKeyPair.recoveryPublicKey(keysPair.privateKey);

  expect(keysPair.address).toEqual(recovered)
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