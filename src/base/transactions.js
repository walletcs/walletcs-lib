require('babel-polyfill');
require("@babel/register");

const errors = require('./errors');

/* Transaction Builders */
class TxBuilderInterface {
  constructor() {
    this.transaction = null;
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

  setGasPrice() {
    errors.errorNotImplementedInterface();
  }

  setGasLimit() {
    errors.errorNotImplementedInterface();
  }

}

class EtherContractTxBuilderInterface extends EtherTxBuilderInterface {

  setMethodName(name) {
    errors.errorNotImplementedInterface();
  }

  setParameters(params) {
    errors.errorNotImplementedInterface();
  }
}

class BitcoinTxBuilderInterfce extends TxBuilderInterface {
  setFromAddress(address) {
    errors.errorNotImplementedInterface();
  }

  addOutx(input) {
    errors.errorNotImplementedInterface();
  }

  setChangeAddress(address) {
    errors.errorNotImplementedInterface();
  }

  calculateFee(fee) {
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
    this.methodName = null;
    this.mthodParams = null;
  }
}

class BitcoinUnsignedTxInterface extends UnsignedTxInterface {
  constructor() {
    super();
    this.amounts = null;
    this.inputs = null;
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
