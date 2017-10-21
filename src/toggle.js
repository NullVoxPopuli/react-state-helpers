import { digIntoState, updateNestedStateForProperty } from './helpers';

export function toggleCreator(context) {
  return property => _event => {
    const value = !digIntoState(property, context.state);

    updateNestedStateForProperty(property, value, context);

    return value;
  };
}
