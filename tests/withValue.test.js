import expect from 'expect';
import { withValue } from '../src/index';

describe('withValue', () => {
  it('takes a function', () => {
    const result = withValue(() => {}, val => val * 2)({ target: { value: 4 }})

    expect(result).toEqual(8);
  });
});
