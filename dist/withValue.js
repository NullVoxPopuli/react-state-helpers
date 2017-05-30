'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withValue = withValue;

var _findValue = require('./findValue');

function withValue(func) {
  return function (e) {
    var value = (0, _findValue.findValue)(e);

    return func(value);
  };
}