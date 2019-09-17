const wallets = require('../walletcs');
const transactions = require('../transactions');
const parsers = require('../parsers');
const errors = require('../base/errors');
const ethers = require('ethers');
const bitcore = require('bitcore-lib');

test('Test create ether pair keys from mnemonic',  async () => {
  const wallet = new wallets.EtherWalletHD();
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  expect(addresses.xPub).toEqual('xpub661MyMwAqRbcG42Nchfke9KUhfnD4BZKko2XrrPTCXaVmZNS9D7AGHFEEpVMF2ddCiRHxY4DGJVyHDsc69qS2Z8c4YCzKbgSpAcpAtuzGKb');
  expect(addresses.xPriv).toEqual('xprv9s21ZrQH143K3ZwuWg8kH1Nk9dwieiqUPa6w4TyqeC3Wtm3HbfnuiUvkPZMx6WcYAMcLphQJnnkautdLoVZmPiXunLdu5jqKPUwK6YDwxb6');

});

test('Test generate ether mnemonic', async () => {
  const mnemonic = wallets.EtherWalletHD.generateMnemonic();
  expect(mnemonic).toBeTruthy()
});

test('Test validation ether mnemonic', async () => {
  const mnemonic = wallets.EtherWalletHD.generateMnemonic();
  expect(wallets.EtherWalletHD.validateMnemonic(mnemonic)).toBeTruthy()
});

test('Test get number account from ether xPub', async () => {
  const wallet = new wallets.EtherWalletHD();
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xpub = addresses.xPub;
  const address = wallet.getAddressFromXpub(xpub);

  expect(address).toEqual('0x343E60ACea58388fCba2C21F302312feCf55175A')
});

test('Test get number account from ether xprv', async () => {
  const wallet = new wallets.EtherWalletHD();
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses.xPriv;
  const child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);

  expect(child1.address).toEqual('0x343E60ACea58388fCba2C21F302312feCf55175A');
  expect(child1.privateKey).toEqual('0x51778a8e47592afeaa55ca845cf27a4a8f996f9590d2694eac9b9fb2b5efd40a');
});

test('Test sign ether transaction by privateKey', async () => {
  const wallet = new wallets.EtherWalletHD();
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses.xPriv;
  const child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
  const tx = new transactions.EtherTx();
  tx.to = '0x343E60ACea58388fCba2C21F302312feCf55175A';
  tx.gasPrice = ethers.utils.bigNumberify(1000000000);
  tx.gasLimit = ethers.utils.bigNumberify(21000);
  tx.value = ethers.utils.parseEther("0.0001");
  const sinedTx = await wallet.signTransactionByPrivateKey(child1.privateKey, tx);

  expect(sinedTx).not.toEqual(undefined);

});

test('Test sign ether transaction by xPriv', async () => {
  const wallet = new wallets.EtherWalletHD();
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses.xPriv;
  const child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
  const tx = new transactions.EtherTx();
  tx.to = '0x343E60ACea58388fCba2C21F302312feCf55175A';
  tx.gasPrice = ethers.utils.bigNumberify(1000000000);
  tx.gasLimit = ethers.utils.bigNumberify(21000);
  tx.value = ethers.utils.parseEther("0.0001");
  const sinedTx = await wallet.signTransactionByPrivateKey(child1.privateKey, tx);
  const xprvSinedTx = await wallet.signTransactionByxPriv(xprv, tx, [child1.address]);

  expect(sinedTx).toEqual(xprvSinedTx);

});

test('Test generate bitcoin mnemonic', async () => {
  const mnemonic = wallets.BitcoinWalletHD.generateMnemonic();

  expect(mnemonic).toBeTruthy()
});

test('Test validate bitcoin mnemonic', async () => {
  const mnemonic = wallets.BitcoinWalletHD.generateMnemonic();

  expect(wallets.BitcoinWalletHD.validateMnemonic(mnemonic)).toBeTruthy()
});

test('Test create bitcoin pair keys from mnemonic',  async () => {
  const wallet = new wallets.BitcoinWalletHD('test3');
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  expect(addresses.xPub).toEqual('tpubD6NzVbkrYhZ4XrDE4teqr4er2nss3a4PJRcqDQSbYSLPWr39DRxFQiv4Ura8mXarzcxCa7a5oQL1yQNDV1gfuzau88xJ18LgQ8DDvzYk8kY');
  expect(addresses.xPriv).toEqual('tprv8ZgxMBicQKsPePBSBEzFSezjTmMvtEsUj823vtQJ8AXzgMnNb38fEEJCJjXc6szrXo97po24x9LPNkB5vhuiCmoWJyrCk6ZNJagjYBAonGS');

});

test('Get bitcoin address from xpub', async() => {
  const network = 'test3';
  const wallet = new wallets.BitcoinWalletHD(network);
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xpub = addresses.xPub;
  const address = wallet.getAddressFromXpub(xpub, 0, network);

  expect('mxztRthVNEED7372vRhEQWuZ16A1qMQriZ').toEqual(address);

});

test('Test bitcoin get number account from xprv', async () => {
  const network = 'test3';
  const wallet = new wallets.BitcoinWalletHD(network);
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses.xPriv;
  const child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0, network);

  expect('mxztRthVNEED7372vRhEQWuZ16A1qMQriZ').toEqual(child1.address);
});

test( 'Test bitcoin get xpub from xprv', async () => {
  const network = 'test3';
  const wallet = new wallets.BitcoinWalletHD(network);
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses.xPriv;
  const recovered = wallet.getxPubFromXprv(xprv, network);

  expect(recovered).toEqual(addresses.xPub);
});

test('Test sign bitcoin transaction by privateKey', async () => {
  const network = 'test3';
  const wallet = new wallets.BitcoinWalletHD(network);
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses.xPriv;
  const child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
  const bitcoinFileTx = { "outx":[{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":2,"address": child1.address,"satoshis":8847983},{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":1,"address":child1.address,"satoshis":20000},{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":0,"address": child1.address,"satoshis":10000}],"from":[child1.address],"to":["mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X","mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X"],"amount":[10000,110000], "changeAddress": child1.address, "fee": null};
  const unsigedTxs = parsers.JSONParser.parseFile(JSON.stringify(bitcoinFileTx));
  const tx = unsigedTxs[0];
  const sinedTx = await wallet.signTransactionByPrivateKey(child1.privateKey, tx);

  expect(sinedTx).not.toEqual(undefined);

});

test('Test sign bitcoin transaction by i', async () => {
  const network = 'test3';
  const wallet = new wallets.BitcoinWalletHD(network);
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses.xPriv;
  const child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
  const bitcoinFileTx = { "outx":[{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":2,"address": child1.address,"satoshis":8847983},{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":1,"address":child1.address,"satoshis":20000},{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":0,"address": child1.address,"satoshis":10000}],"from":[child1.address],"to":["mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X","mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X"],"amount":[10000,110000], "changeAddress": child1.address, "fee": null};
  const unsigedTxs = parsers.JSONParser.parseFile(JSON.stringify(bitcoinFileTx));
  const tx = unsigedTxs[0];
  const sinedTx = await wallet.signTransactionByPrivateKey(child1.privateKey, tx);
  const xprvSinedTx = await wallet.signTransactionByxPriv(xprv, tx, [child1.address]);

  expect(sinedTx).toEqual(xprvSinedTx);

});

test('Test create bitcoin xPriv with bad mnemonic', async () => {
  const network = 'test3';
  const wallet = new wallets.BitcoinWalletHD(network);

  await expect(
    wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp')
  ).rejects.toThrowError(errors.MNEMONIC);
});

test('Test create ether xPriv with bad mnemonic', async () => {
  const wallet = new wallets.EtherWalletHD();

  await expect(
    wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp')
  ).rejects.toThrowError(errors.MNEMONIC);
});

test('Test create bitcoin address/PrivateKey with bad xPriv', async () => {
  const network = 'test3';
  const wallet = new wallets.BitcoinWalletHD(network);
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses.xPriv;

  expect(() => {
    wallet.getAddressWithPrivateFromXprv(xprv + '!', 0);
  }).toThrowError(errors.XPRIV);
});

test('Test create ether address/PrivateKey with bad xPriv', async () => {
  const wallet = new wallets.EtherWalletHD();
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses.xPriv;

  expect(() => {
    wallet.getAddressWithPrivateFromXprv(xprv + '!', 0);
  }).toThrowError(errors.XPRIV);
});

test('Test create bitcoin address/PrivateKey with bad privateKey', async () =>{
  const network = 'test3';
  const wallet = new wallets.BitcoinWalletHD(network);
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses.xPriv;
  const child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
  const bitcoinFileTx = { "outx":[{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":2,"address": child1.address,"satoshis":8847983},{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":1,"address":child1.address,"satoshis":20000},{"txId":"191d12fe3ada580f7af7322b8fcdb840123106659fe1ebb9898c70e1b4232072","outputIndex":0,"address": child1.address,"satoshis":10000}],"from":[child1.address],"to":["mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X","mfaEV17ReZSubrJ8ohPWB5PQqPiLMgc47X"],"amount":[10000,110000], "changeAddress": child1.address, "fee": null};
  const unsigedTxs = parsers.JSONParser.parseFile(JSON.stringify(bitcoinFileTx));
  const tx = unsigedTxs[0];

  await expect(wallet.signTransactionByPrivateKey(child1.privateKey + '1', tx)
  ).rejects.toThrowError(errors.PRIVATE_KEY);
});

test('Test create ether address/PrivateKey with bad privateKey', async () => {
  const wallet = new wallets.EtherWalletHD();
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses.xPriv;
  const child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
  const tx = new transactions.EtherTx();
  tx.to = '0x343E60ACea58388fCba2C21F302312feCf55175A';
  tx.gasPrice = ethers.utils.bigNumberify(1000000000);
  tx.gasLimit = ethers.utils.bigNumberify(21000);
  tx.value = ethers.utils.parseEther("0.0001");

  await expect(wallet.signTransactionByPrivateKey(child1.privateKey + '1', tx)
  ).rejects.toThrowError(errors.PRIVATE_KEY);

});

test('Test create multisign address', async() =>{
  const network = 'test3';
  const wallet = new wallets.BitcoinWalletHD(network);
  const addresses = await wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses.xPriv;
  const pair1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);
  const pair2 = wallet.getAddressWithPrivateFromXprv(xprv, 1);
  const publicKeys = [pair2.privateKey, pair1.privateKey].map(function (key) {
    return wallets.BitcoinWalletHD.getPublicKeyFromPrivateKey(key);
  });
  const multiSignAddress = wallets.BitcoinWalletHD.createMultiSignAddress(2, 'main', publicKeys);

  expect(multiSignAddress).not.toEqual('39vQqW5Ykt5C66FfV2J6UApUEkLkcAKuqj');
});


test('Test create multisign tx', async () => {

});
