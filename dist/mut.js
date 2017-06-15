'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mutCreator = mutCreator;

var _findValue = require('./findValue');

var _helpers = require('./helpers');

// --------------------------------
// using ember-inspired mut helper
// --------------------------------
// usage:
//   in constructor:
//     this.mut = mutCreator(this);
//
//  in render:
//     const mut = this.mut;
//     ...
//     onChange={mut('property')}
//
//  also:
//     onChange={mut('property', parseFloat)}
function mutCreator(context) {
  // mut => the function called by whatever event
  return function (property, transform) {
    return function (e) {
      var isFunction = typeof transform === 'function';
      var passedValue = (0, _findValue.findValue)(e);
      var value = isFunction ? transform(passedValue) : passedValue;

      (0, _helpers.updateNestedStateForProperty)(property, value, context);

      return value;
    };
  };
}
exports['default'] = module.exports;
exports.default = module.exports;