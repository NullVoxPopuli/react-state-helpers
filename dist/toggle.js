'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleCreator = toggleCreator;

var _helpers = require('./helpers');

var _LifeCycle = require('./LifeCycle');

var _LifeCycle2 = _interopRequireDefault(_LifeCycle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toggleCreator(context) {
  return function (property, opts) {
    return function (_event) {
      var nextValue = !(0, _helpers.digIntoState)(property, context.state);

      var updateState = function updateState() {
        (0, _helpers.updateNestedStateForProperty)(property, nextValue, context);
        return nextValue;
      };

      return (0, _LifeCycle2.default)(updateState, nextValue, opts);
    };
  };
}
exports['default'] = module.exports;
exports.default = module.exports;