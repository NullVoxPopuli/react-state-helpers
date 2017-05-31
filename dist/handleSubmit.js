'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.handleSumbit = handleSumbit;

var _helpers = require('./helpers');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// NOTE: typeof form.elements === 'object'
//
// form.elements is an object that acts like an array.
// it has keys of 0..numberOfInputs in addition to key: value,
// entries that match the input name attributes with their
// corresponding value.
//
// form.elements.length returns the number of input elements
// including select, radio, checkboxes, and submit inputs.
//
// something to keep in mind, is that the key-value part of
// form.elements is built off the name attribute, so if an input
// doesn't have a name attribute (like a submit input), it will
// appear as "": "Submit Text"
function handleSumbit(func) {
  return function (e) {
    e.preventDefault();

    var form = e.target;
    var elements = form.elements;
    var numElements = elements.length;
    var values = {};

    for (var i = 0; i < numElements; i += 1) {
      var input = elements[i];
      var isValueIgnored = input.type === 'radio' && !input.checked;

      // radio buttons must have a value, and therefore we don't
      // care about them if they aren't checked.
      if (!isValueIgnored) {
        var value = (0, _helpers.valueOfInput)(input);

        values = _extends({}, values, _defineProperty({}, input.name, value));
      }
    }

    return func(values);
  };
}
exports['default'] = module.exports;
exports.default = module.exports;