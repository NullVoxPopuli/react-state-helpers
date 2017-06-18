import { findValue } from './findValue';
import { updateNestedStateForProperty } from './helpers';
import doLifeCycle from './doLifeCycle';
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
  return (property, opts) => e => {
    const passedValue = findValue(e);

    const updateState = value => updateNestedStateForProperty(property, value, context);

    return doLifeCycle(updateState, passedValue, opts);
  };
}
