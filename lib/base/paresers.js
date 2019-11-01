"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var errors = require('./errors');

var FileParserInterface =
/*#__PURE__*/
function () {
  function FileParserInterface() {
    (0, _classCallCheck2["default"])(this, FileParserInterface);
  }

  (0, _createClass2["default"])(FileParserInterface, [{
    key: "getType",
    value: function getType(file) {
      errors.errorNotImplementedInterface();
    }
  }, {
    key: "parseFile",
    value: function parseFile(file, type) {
      errors.errorNotImplementedInterface();
    }
  }]);
  return FileParserInterface;
}();

module.exports = {
  FileParserInterface: FileParserInterface
};