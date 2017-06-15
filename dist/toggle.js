'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleCreator = toggleCreator;

var _helpers = require('./helpers');

function toggleCreator(context) {
  return function (property, cb) {
    return function (_event) {
      var value = !(0, _helpers.digIntoState)(property, context.state);
      (0, _helpers.updateNestedStateForProperty)(property, value, context);

      var isFunction = typeof transform === 'function';
      if (isFunction) cb(value);

      return value;
    };
  };
}
exports['default'] = module.exports;
exports.default = module.exports;