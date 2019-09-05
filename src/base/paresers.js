const errors = require('./errors');

class FileParserInterface {
  getType(file){
    errors.errorNotImplementedInterface();
  }

  paresFile(file, type) {
     errors.errorNotImplementedInterface();
  }

}


module.exports = {
  FileParserInterface
};