'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mutCreator = mutCreator;
exports.toggleCreator = toggleCreator;
exports.withValue = withValue;
exports.findValue = findValue;
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
      console.log(transform);
      var isFunction = typeof transform === 'function';
      var passedValue = findValue(e);
      var value = isFunction ? transform(passedValue) : passedValue;

      console.log(isFunction);

      updateNestedStateForProperty(property, value, context);

      return value;
    };
  };
}

function toggleCreator(context) {
  return function (property) {
    return function (e) {
      var value = !digIntoState(property, context.state);
      updateNestedStateForProperty(property, value, context);

      return value;
    };
  };
}

function withValue(func) {
  return function (e) {
    var value = findValue(e);

    return func(value);
  };
}

// -----------------------
// various helpers
// -----------------------
function findValue(e) {
  if (e === undefined || e === null) return null;
  if (e.target && (e.target.value || e.target.value === '')) return e.target.value;
  if (e.value) return e.value;

  return e;
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
