'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findValue = findValue;
function findValue(e) {
  if (e === undefined || e === null) return null;
  if (e.target && (e.target.value || e.target.value === '')) return e.target.value;
  if (e.value) return e.value;

  return e;
}
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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleSumbit = exports.toggleCreator = exports.mutCreator = exports.findValue = exports.withValue = undefined;

var _withValue = require('./withValue');

Object.defineProperty(exports, 'withValue', {
  enumerable: true,
  get: function get() {
    return _withValue.withValue;
  }
});

var _findValue = require('./findValue');

Object.defineProperty(exports, 'findValue', {
  enumerable: true,
  get: function get() {
    return _findValue.findValue;
  }
});

var _mut = require('./mut');

Object.defineProperty(exports, 'mutCreator', {
  enumerable: true,
  get: function get() {
    return _mut.mutCreator;
  }
});

var _toggle = require('./toggle');

Object.defineProperty(exports, 'toggleCreator', {
  enumerable: true,
  get: function get() {
    return _toggle.toggleCreator;
  }
});

var _handleSubmit = require('./handleSubmit');

Object.defineProperty(exports, 'handleSumbit', {
  enumerable: true,
  get: function get() {
    return _handleSubmit.handleSumbit;
  }
});

var _stateWrapper = require('./state-wrapper');

exports.default = _stateWrapper.stateWrapper;
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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.stateWrapper = stateWrapper;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _withValue = require('./withValue');

var _findValue = require('./findValue');

var _mut = require('./mut');

var _toggle = require('./toggle');

var _handleSubmit = require('./handleSubmit');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Higher-Order-Component for adding all the functionality of
// react-state-helpers to a component
function stateWrapper(WrappedComponent) {
  return function (_Component) {
    _inherits(_class, _Component);

    function _class(props) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

      _this.state = {
        stateHelpers: {
          mut: (0, _mut.mutCreator)(_this),
          toggle: (0, _toggle.toggleCreator)(_this),
          withValue: _withValue.withValue,
          findValue: _findValue.findValue,
          handleSumbit: _handleSubmit.handleSumbit
        }
      };
      return _this;
    }

    _createClass(_class, [{
      key: 'render',
      value: function render() {
        var props = _extends({}, this.state.stateHelpers, this.props, {
          values: this.state
        });

        return _react2.default.createElement(WrappedComponent, props);
      }
    }]);

    return _class;
  }(_react.Component);
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleCreator = toggleCreator;

var _helpers = require('./helpers');

function toggleCreator(context) {
  return function (property) {
    return function (_event) {
      var value = !(0, _helpers.digIntoState)(property, context.state);
      (0, _helpers.updateNestedStateForProperty)(property, value, context);

      return value;
    };
  };
}
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
