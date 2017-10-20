import expect from 'expect';
import { deepLeftEquals } from '../src/helpers';

describe('deepLeftEquals', () => {
  const scenarios = [
    { expected: true, name: 'empty objects', a: {}, b: {} },
    { expected: true, name: 'empty arrays', a: [], b: [] },
    { expected: true, name: 'empty strings', a: '', b: '' },
    { expected: true, name: 'shallow objects', a: { a: 1 }, b: { a: 1 } },
    { expected: true, name: 'shallow arrays', a: [1, 2], b: [1, 2] },
    { expected: true, name: 'nested objects', a: { a: { b: 1} }, b: { a: { b: 1 } } },
    { expected: true, name: 'left object compare', a: { a: 1 }, b: { a: 1, b: 2 } }
  ];

  scenarios.forEach(scenario => {
    const { a, b, expected, name } = scenario;

    it(`comparing ${name} is ${expected}`, () => {
      const result = deepLeftEquals(a, b);

      expect(result).toEqual(expected);
    });
  });

});
