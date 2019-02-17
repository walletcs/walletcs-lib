import {EtherTransactionDecoder, EtherTransaction, EtherKeyPair} from './ether/transactions';
import {FileTransactionGenerator, KeyTool} from './walletcs-ether';

export default class Ether {
    txDecoder = EtherTransactionDecoder;
    transaction = EtherTransaction;
    keys = EtherKeyPair;
    file = FileTransactionGenerator;
    keyTools = KeyTool;
}
