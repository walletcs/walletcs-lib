"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

require('babel-polyfill');

require("@babel/register");

var errors = require('./errors');

var FileParserInterface =
/*#__PURE__*/
function () {
  function FileParserInterface() {
    _classCallCheck(this, FileParserInterface);
  }

  _createClass(FileParserInterface, [{
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