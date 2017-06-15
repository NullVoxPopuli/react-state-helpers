'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mutCreator = mutCreator;

var _findValue = require('./findValue');

var _helpers = require('./helpers');

var _LifeCycle = require('./LifeCycle');

var _LifeCycle2 = _interopRequireDefault(_LifeCycle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  return function (property, opts) {
    return function (e) {
      var passedValue = (0, _findValue.findValue)(e);

      var updateState = function updateState(value) {
        return (0, _helpers.updateNestedStateForProperty)(property, value, context);
      };

      return (0, _LifeCycle2.default)(updateState, passedValue, opts);
    };
  };
}
exports['default'] = module.exports;
exports.default = module.exports;