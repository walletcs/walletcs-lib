const _ = require('lodash');
const parsers = require('./base/paresers');
const errors = require('./base/errors');
const structures = require('./base/structures');
const transactions = require('./transactions');

const FILES_TYPES = {
  ether: 'ETHFileTX',
  bitcoin: 'BTCFileTx',
  unknown: 'unknown'
};


class JSONParser extends parsers.FileParserInterface {
  static parseFile(file) {
    try {
      const data = JSON.parse(file);
      const typeFile = JSONParser.getType(data);

      if (typeFile === FILES_TYPES.unknown) throw Error(errors.PARSING_ERROR);

      const result = [];
      if (typeFile === FILES_TYPES.ether) {
        try{
          this.__checkListStructure(data.transactions, structures.EtherTransaction);
          const builder = new transactions.EtherTx();
          const director = new transactions.TransactionConstructor(builder);
          _.each(data.transactions, function (tx) {
            result.push(director.buildEtherTx(tx));
          });
        }catch (e) {
          this.__checkListStructure(data.transactions, structures.EtherContractTransaction);
          const builder = new transactions.EtherContractTxBuilder();
          const director = new transactions.TransactionConstructor(builder);
          _.each(data.transactions, function (tx) {
            const contract = _.filter(data.contracts, function (contract) {
              return contract.address === tx.to;
            });
            result.push(director.buildEtherContractTx(tx, contract[0]));
          });
        }
      }

      if (typeFile === FILES_TYPES.bitcoin) {
        this.__checkListStructure(data.outxs, structures.Outx);
        const builder = new transactions.BitcoinTxBuilder();
        const director = new transactions.TransactionConstructor(builder);
        for (let i = 0; i < data.outxs.length; i += 1) {
          result.push(director.buildBitcoinTx(data.outxs[i], data.from, data.to, data.changeAddress));
        }
      }

      return result;
      
    }catch (e) {
      throw Error(errors.PARSING_ERROR)
    }
  }

  static getType(data){
    if (Object.keys(data) === Object.keys(structures.BitcoinFileTransaction)){
      return FILES_TYPES.bitcoin;
    }
    if (Object.keys(data) === Object.keys((structures.EtherFileTransaction))){
      return FILES_TYPES.ether;
    }

    return FILES_TYPES.unknown;
  }
  
  __checkListStructure(data, structure){
    _.each(data, function (item) {
       if(Object.keys(item) !== Object.keys(structure)){
         throw Error(errors.PARSING_ERROR)
       }
    })
  }
}
