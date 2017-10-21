'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleCreator = toggleCreator;

var _helpers = require('./helpers');

function toggleCreator(context) {
  return function (property) {
    return function (_event) {
      var value = !(0, _helpers.digIntoState)(property, context.state);

      (0, _helpers.updateNestedStateForProperty)(property, value, context);

      return value;
    };
  };
}
exports['default'] = module.exports;
exports.default = module.exports;