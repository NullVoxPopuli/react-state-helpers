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
exports['default'] = module.exports;
exports.default = module.exports;