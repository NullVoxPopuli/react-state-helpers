'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findValue = findValue;
function findValue(e) {
  if (e === undefined || e === null) return null;

  var target = e.target;

  if (target) {
    var checked = target.checked,
        value = target.value;


    if (checked !== undefined) {
      return checked && value || checked;
    }

    if (value || value === '') return value;
  }

  if (e.value) return e.value;

  return e;
}
exports['default'] = module.exports;
exports.default = module.exports;