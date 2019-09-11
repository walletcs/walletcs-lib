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
        _.each(data.transactions, function (tx) {
          let builder = null;
          let director = null;
          let createdTx = null;

          if(JSONParser.__isEtherStructure(tx)){
            builder = new transactions.EtherTxBuilder();
            director = new transactions.TransactionConstructor(builder);
            createdTx = director.buildEtherTx(tx)}
          else if(JSONParser.__isContractStructure(tx)){
            builder = new transactions.EtherContractTxBuilder();
            director = new transactions.TransactionConstructor(builder);
            const contract = _.filter(data.contracts, function (contract) {
              return contract.address === tx.to;
            });
            createdTx = director.buildEtherContractTx(tx, contract[0].abi);
          }else{
            throw Error(errors.PARSING_ERROR);
          }
          result.push(createdTx);
        });
      }

      if (typeFile === FILES_TYPES.bitcoin) {
        JSONParser.__checkListStructure(data.outx, structures.Outx);
        const builder = new transactions.BitcoinTxBuilder();
        const director = new transactions.TransactionConstructor(builder);
        const tx = director.buildBitcoinTx(data.outx, data.from, data.to, data.amount, data.changeAddress);
        result.push(tx);

      }

      return result;
      
    }catch (e) {
      console.log(e);
      throw Error(errors.PARSING_ERROR)
    }
  }

  static getType(data){
    const sortedKeys = Object.keys(data).sort();
    if (_.isEqual(sortedKeys, Object.keys(structures.BitcoinFileTransaction).sort())){
      return FILES_TYPES.bitcoin;
    }

    if (_.isEqual(sortedKeys, Object.keys(structures.EtherFileTransaction).sort())){
      return FILES_TYPES.ether;
    }

    return FILES_TYPES.unknown;
  }

  static __isContractStructure(data){
    return this.__checkStructure(data, structures.EtherContractTransaction);
  }

  static __isEtherStructure(data){
    return this.__checkStructure(data, structures.EtherTransaction);
  }

  static __checkStructure(inputStructure, exampleStructure) {
    return _.isEqual(Object.keys(inputStructure).sort(), Object.keys(exampleStructure).sort())
  }
  
  static __checkListStructure(data, structure){
    const sortedKeys = Object.keys(structure).sort();
    _.each(data, function (item) {
      console.log(!_.isEqual(Object.keys(item).sort(), sortedKeys));
       if(!_.isEqual(Object.keys(item).sort(), sortedKeys)){
         throw Error(errors.PARSING_ERROR)
       }
    })
  }
}

module.exports = {
  JSONParser,
};