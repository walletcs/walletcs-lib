const wallets = require('../walletcs');


test('Test create pair keys from mnemonic',  async () => {
  const wallet = new wallets.EtherWalletHD();
  const addresses = wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  expect(addresses.xPub).toEqual('xpub661MyMwAqRbcG42Nchfke9KUhfnD4BZKko2XrrPTCXaVmZNS9D7AGHFEEpVMF2ddCiRHxY4DGJVyHDsc69qS2Z8c4YCzKbgSpAcpAtuzGKb');
  expect(addresses.xPrv).toEqual('xprv9s21ZrQH143K3ZwuWg8kH1Nk9dwieiqUPa6w4TyqeC3Wtm3HbfnuiUvkPZMx6WcYAMcLphQJnnkautdLoVZmPiXunLdu5jqKPUwK6YDwxb6');

});

test('Test generate mnemonic', async () => {
  const mnemonic = wallets.EtherWalletHD.generateMnemonic();
  expect(mnemonic).toBeTruthy()
});

test('Test validation mnemonic', async () => {
  const mnemonic = wallets.EtherWalletHD.generateMnemonic();
  expect(wallets.EtherWalletHD.validateMnemonic(mnemonic)).toBeTruthy()
});

test('Test get number account from xpub', async () => {
  const wallet = new wallets.EtherWalletHD();
  const addresses = wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xpub = addresses.xPub;
  const address = wallet.getAddressFromXpub(xpub);
  expect(address).toEqual('0x343E60ACea58388fCba2C21F302312feCf55175A')
});

test('Test get number account from xprv', async () => {
  const wallet = new wallets.EtherWalletHD();
  const addresses = wallet.getFromMnemonic('cage fee ghost conduct beyond fork vapor gasp december online dinner donor');
  const xprv = addresses.xPrv;
  const child1 = wallet.getAddressWithPrivateFromXprv(xprv, 0);

  expect(child1.address).toEqual('0x343E60ACea58388fCba2C21F302312feCf55175A');
  expect(child1.privateKey).toEqual('0x51778a8e47592afeaa55ca845cf27a4a8f996f9590d2694eac9b9fb2b5efd40a');
});