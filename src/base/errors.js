const PARSING_ERROR = 'Error parser file. Check format file.';
const INTERFACE_ERROR = 'This method must be implement.';

function errorNotImplementedInterface() {
  throw Error(INTERFACE_ERROR);
}

module.exports = {
  errorNotImplementedInterface,
  PARSING_ERROR
};