'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = doLifeCycle;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function doLifeCycle(main, nextValue) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var transform = void 0;
  var beforeUpdate = void 0;
  var afterUpdate = void 0;

  var defaults = {
    transform: function transform(value) {
      return value;
    },
    beforeUpdate: [function () {
      return true;
    }],
    afterUpdate: []
  };

  if (typeof opts === 'function') {
    transform = opts;
    beforeUpdate = [function () {
      return true;
    }];
    afterUpdate = [];
  } else if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object') {
    if (opts.beforeUpdate || opts.afterUpdate) {
      var options = [].concat(_toConsumableArray(defaults), _toConsumableArray(opts));

      transform = options.transform ? options.transform : function (value) {
        return value;
      };
      beforeUpdate = [function () {
        return true;
      }].concat(options.beforeUpdate);
      afterUpdate = [].concat(options.afterUpdate);
    } else {
      transform = defaults.transform;
      beforeUpdate = defaults.beforeUpdate;
      afterUpdate = defaults.afterUpdate;
    }
  } else throw new Error('Illegal options supplied to cycle.');

  return run(main, nextValue, transform, beforeUpdate, afterUpdate);
}

function doTransform(transform, nextValue) {
  return transform(nextValue);
}

function doPreUpdate(before, nextValue) {
  return before.map(function (func) {
    return func.call(nextValue);
  }).every(function (v) {
    return v;
  });
}

function afterUpdate(currentValue, after) {
  after.map(function (func) {
    return func.call(currentValue);
  });
}

function run(main, nextValue, transform, before, after) {
  if (!before.every(function (func) {
    return typeof func === 'function';
  }) || !after.every(function (func) {
    return typeof func === 'function';
  })) {
    throw new Error('Expected all hooks to be typeof function');
  }

  var transformedValue = doTransform(transform, nextValue);

  var returnValue = nextValue;
  if (doPreUpdate(before, nextValue)) {
    main(transformedValue);
    returnValue = transformedValue;
    afterUpdate(returnValue, after);
  }

  return returnValue;
}