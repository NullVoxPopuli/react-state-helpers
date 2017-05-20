import { findValue } from './findValue';
import { updateNestedStateForProperty } from './helpers';
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
export function mutCreator(context) {
  // mut => the function called by whatever event
  return (property, transform) => e => {
    const isFunction = typeof transform === 'function';
    const passedValue = findValue(e);
    const value = isFunction ? transform(passedValue) : passedValue;

    updateNestedStateForProperty(property, value, context);

    return value;
  };
}
