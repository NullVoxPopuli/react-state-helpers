import expect from 'expect';
import { findValue } from '../src/index';

describe('findValue', () => {
  const scenarios = [
    { expected: 'string', name: 'value: string', e: { target: { value: 'string' } } },
    { expected: 'a', name: 'value: small string', e: { target: { value: 'a' } } },
    { expected: '', name: 'value: empty string', e: { target: { value: '' } } },
    { expected: { target: { value: undefined } }, name: 'value: undefined', e: { target: { value: undefined } } },
    { expected: 2, name: 'value: number', e: { target: { value: 2 } } },
    { expected: true, name: 'checked: boolean', e: { target: { checked: true } } },
    { expected: false, name: 'checked: boolean', e: { target: { checked: false } } },
    { expected: 'true', name: 'checked + value: true', e: { target: { checked: true, value: 'true' } } },
    { expected: false, name: 'checked + value: false', e: { target: { checked: false, value: 'false' } } },
  ]

  scenarios.forEach(scenario => {
    const { e, expected, name } = scenario;

    it(`${name} is ${expected}`, () => {
      const result = findValue(e);

      expect(result).toEqual(expected);
    });
  });
});
