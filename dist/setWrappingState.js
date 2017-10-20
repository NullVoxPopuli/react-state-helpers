'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setWrappingStateCreator = setWrappingStateCreator;

var _helpers = require('./helpers');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function setWrappingStateCreator(context) {
  return function (nextState) {
    var originalState = context.state;
    // remove helper functions
    // NOTE: if anyone actually defines this and wants these set...
    //       uhhh.... they need better naming decisions...

    var mut = nextState.mut,
        toggle = nextState.toggle,
        withValue = nextState.withValue,
        findValue = nextState.findValue,
        handleSubmit = nextState.handleSubmit,
        values = nextState.values,
        scrubbedState = _objectWithoutProperties(nextState, ['mut', 'toggle', 'withValue', 'findValue', 'handleSubmit', 'values']);

    var shouldUpdate = !(0, _helpers.deepLeftEquals)(scrubbedState, originalState);

    if (shouldUpdate) return context.setState(nextState);

    // otherwise, we have no need to update.
    // this prevents infinite loops when
    // setWrappingState is used within a function that
    // causes a re-render
    //
    // NOTE: if setWrappingState does any incrementing,
    //       an infinite loop will still occur
  };
}
exports['default'] = module.exports;
exports.default = module.exports;