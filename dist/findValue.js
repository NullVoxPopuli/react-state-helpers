'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findValue = findValue;
// testing actual DOM event attributes
// https://jsfiddle.net/rv5msf8c/
function findValue(e) {
  if (e === undefined || e === null) return null;

  var target = e.target;

  if (target) {
    var checked = target.checked,
        value = target.value,
        type = target.type,
        attributes = target.attributes;

    var checkable = type === 'checkbox' || type === 'radio';

    if (checked !== undefined && checkable) {
      var valueEmpty = value === null || value === undefined || value === '';

      if (checked && !valueEmpty) return value;

      return checked;
    }

    if (value || value === '') return value;
  }

  if (e.value) return e.value;

  return e;
}
exports['default'] = module.exports;
exports.default = module.exports;