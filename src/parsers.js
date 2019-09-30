require('babel-polyfill');
require("@babel/register");

const _ = require('lodash');
const parsers = require('./base/paresers');
const errors = require('./base/errors');
const structures = require('./base/structures');
const transactions = require('./transactions');

const FILES_TYPES = {
  ether: 'ETHFileTx',
  bitcoin: 'BTCFileTx',
  unknown: 'unknown'
};


class JSONParser extends parsers.FileParserInterface {
  static parseFile(file) {
    try {
      console.log(file);
      const data = JSON.parse(file);
      const typeFile = JSONParser.getType(file);

      if (typeFile === FILES_TYPES.unknown) throw Error(errors.PARSING_ERROR);

      const result = [];
      if (typeFile === FILES_TYPES.ether) {
        _.each(data.transactions, function (tx) {
          let builder = null;
          let director = null;
          let createdTx = null;
          if(JSONParser.__isEtherTx(tx)){
            builder = new transactions.EtherTxBuilder();
            director = new transactions.TransactionConstructor(builder);
            createdTx = director.buildEtherTx(tx)}
          else if(JSONParser.__isContractTx(tx)){
            builder = new transactions.EtherContractTxBuilder();
            director = new transactions.TransactionConstructor(builder);
            const address = tx.to[0] ? tx.to[0].address : tx.to.address;
            const contract = _.filter(data.contracts, function (contract) {
              return contract.address === address;
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
        const tx = director.buildBitcoinTx(data.outx, data.from, data.to, data.fee);
        if (tx) result.push(tx);

      }
      return result;
    }catch (e) {
      console.log('ERROR INFO:', e);
      throw Error(errors.PARSING_ERROR)
    }
  }

  static getType(file){
    try{
      const data = JSON.parse(file);
      const sortedKeys = Object.keys(data).sort();
      if (_.isEqual(sortedKeys, Object.keys(structures.BitcoinFileTransaction).sort())){
        return FILES_TYPES.bitcoin;
      }

      if (_.isEqual(sortedKeys, Object.keys(structures.EtherFileTransaction).sort())){
        return FILES_TYPES.ether;
      }
      return FILES_TYPES.unknown;
    }catch (e) {
      return FILES_TYPES.unknown;
    }

  }

  static __isContractTx(data){
    return !!data.data && data.data !== '0x'
  }

  static __isEtherTx(data){
    return !JSONParser.__isContractTx(data)
  }

  static __checkStructure(inputStructure, exampleStructure) {
    return _.isEqual(Object.keys(inputStructure).sort(), Object.keys(exampleStructure).sort())
  }
  
  static __checkListStructure(data, structure){
    const sortedKeys = Object.keys(structure).sort();
    _.each(data, function (item) {
       if(!_.isEqual(Object.keys(item).sort(), sortedKeys)){
         throw Error(errors.PARSING_ERROR)
       }
    })
  }
}

module.exports = {
  JSONParser,
};
