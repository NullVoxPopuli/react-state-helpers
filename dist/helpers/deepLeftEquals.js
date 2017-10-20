"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepLeftEquals = deepLeftEquals;
// recursively checks if newObject's keys exist in
// sourceObject and they all have the same value.
//
// if sourceObject has extra keys, that doesn't matter.

var isArray = Array.isArray;
// NOTE: arrays are also objects
var isObject = function isObject(o) {
  return o instanceof Object;
};
var isTrue = function isTrue(o) {
  return o === true;
};

function deepLeftEquals(a, b) {
  if (a === b) return true;

  if (isArray(a) && isArray(b)) return arrayExactlyEquals(a, b);else if (isObject(a) && isObject(b)) return objectKVPairsEqualTargetKVPairs(a, b);

  return false;
}

// here is where we don't care about b having extra keys
function objectKVPairsEqualTargetKVPairs(a, b) {
  return Object.keys(a).map(function (key) {
    return deepLeftEquals(a[key], b[key]);
  }).every(isTrue);
}

function arrayExactlyEquals(a, b) {
  if (!equalLength(a, b)) return false;

  return a.map(function (ae, i) {
    return deepLeftEquals(ae, b[i]);
  }).every(isTrue);
}

function equalLength(a, b) {
  return a.length === b.length;
}
exports["default"] = module.exports;
exports.default = module.exports;