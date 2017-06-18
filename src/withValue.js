import { findValue } from './findValue';
import doLifeCycle from './doLifeCycle';

export function withValue(func, opts) {
  return e => {
    const value = findValue(e);

    return doLifeCycle(func, value, opts);
  };
}
