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