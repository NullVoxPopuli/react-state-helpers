import { findValue } from './findValue';

export function withValue(func) {
  return e => {
    const value = findValue(e);

    return func(value);
  };
}
