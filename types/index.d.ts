import * as AEtherTransactionDecoder from '../src/ether/transactions';
import * as AEtherTransaction from '../src/ether/transactions';
import * as AEtherKeyPair from '../src/ether/transactions';
import * as AFileTransactionGenerator from '../src/walletcs-ether';
import * as AKeyTool from '../src/walletcs-ether';


export default class Ether {
    constructor();

    txDecoder: AEtherTransactionDecoder;
    transaction: AEtherTransaction;
    keys: AEtherKeyPair;
    file: AFileTransactionGenerator;
    keyTools: AKeyTool;
    version: string;
}
