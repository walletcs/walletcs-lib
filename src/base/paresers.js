require('babel-polyfill');
require("@babel/register");
const errors = require('./errors');

class FileParserInterface {
  getType(file){
    errors.errorNotImplementedInterface();
  }

  parseFile(file, type) {
     errors.errorNotImplementedInterface();
  }

}


module.exports = {
  FileParserInterface
};