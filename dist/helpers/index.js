'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.valueOfInput = valueOfInput;
exports.digIntoState = digIntoState;
exports.updateNestedStateForProperty = updateNestedStateForProperty;
exports.propertyToObject = propertyToObject;
function valueOfInput(input) {
  if (input.type === 'checkbox' && !input.value) return input.checked;
  if (input.type === 'radio') return input.value;

  return input.value;
}

// given a string.object.notation, this will
// crawl the state object tree, and return the value of
// the right most property.
function digIntoState(property, state) {
  var properties = property.split('.');
  var firstProperty = properties[0];
  var others = properties.slice(1)[0];

  if (others === undefined) return state[firstProperty];

  return digIntoState(others, state[firstProperty]);
}

// expands a property path string to an object, and
// updates the state
function updateNestedStateForProperty(property, value, context) {
  var newPartialState = propertyToObject(property, value);
  context.setState(newPartialState);
}

// converts a.property.path, targetValue to
// { a: { property: { path: targetValue}}
function propertyToObject(propertyPath, targetValue) {
  var properties = propertyPath.split('.');
  var lastProperty = properties[properties.length - 1];

  return properties.reduceRight(function (accumulator, key) {
    var o = {};
    o[key] = accumulator;

    if (key === lastProperty) o[key] = targetValue;

    return o;
  }, {});
}