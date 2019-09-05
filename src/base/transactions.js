require('babel-polyfill');
const errors = require('./errors');

/* Transaction Builders */
class TxBuilderInterface {
  constructor() {
    this.transaction = null;
    if (!this.transaction) errorNotImpementedInterface()
  }

  setFromAddress(address) {
    errors.errorNotImplementedInterface();
  }

  setToAddress(address) {
    errors.errorNotImplementedInterface();
  }

  setAmount(amount) {
    errors.errorNotImplementedInterface();
  }

  getResult() {
    errors.errorNotImplementedInterface();
  }
}

class EtherTxBuilderInterface extends TxBuilderInterface {
  setNonce(nonce) {
    errors.errorNotImplementedInterface();
  }

  calculateGasPrice() {
    errors.errorNotImplementedInterface();
  }

  calculateGasLimit() {
    errors.errorNotImplementedInterface();
  }

}

class EtherContractTxBuilderInterface extends EtherTxBuilderInterface {
  setMethodData(data) {
    errors.errorNotImplementedInterface();
  }

  setAbi(abi) {
    errors.errorNotImplementedInterface();
  }
}

class BitcoinTxBuilderInterfce extends TxBuilderInterface {
  addInput(input) {
    errors.errorNotImplementedInterface();
  }

  calculateChange() {
    errors.errorNotImplementedInterface();
  }

  calculateFee() {
    errors.errorNotImplementedInterface();
  }
}

/* Unsigned Transactions */
class UnsignedTxInterface {
  constructor() {
    this.to = null;
    this.from = null;
  }

  toJSON() {
    errors.errorNotImplementedInterface();
  }
}

class EtherUnsignedTxInterface extends UnsignedTxInterface {
  constructor() {
    super();
    this.value = null;
    this.gasLimit = null;
    this.gasPrice = null;
    this.nonce = null;
  }
}

class EtherContractUnsignedTxInterface extends EtherUnsignedTxInterface {
  constructor() {
    super();
    this.abi = null;
  }
}

class BitcoinUnsignedTxInterface extends UnsignedTxInterface {
  constructor() {
    super();
    this.amounts = null;
    this.inputs = null;
    this.change = null;
    this.changeAddress = null;
    this.fee = null;
  }
}

module.exports = {
  BitcoinTxBuilderInterfce,
  EtherTxBuilderInterface,
  EtherContractTxBuilderInterface,
  BitcoinUnsignedTxInterface,
  EtherUnsignedTxInterface,
  EtherContractUnsignedTxInterface,
};
