export { deepLeftEquals } from './deepLeftEquals';

export function valueOfInput(input) {
  if (input.type === 'checkbox' && !input.value) return input.checked;
  if (input.type === 'radio') return input.value;

  return input.value;
}

// given a string.object.notation, this will
// crawl the state object tree, and return the value of
// the right most property.
export function digIntoState(property, state) {
  const properties = property.split('.');
  const firstProperty = properties[0];
  const others = properties.slice(1)[0];

  if (others === undefined) return state[firstProperty];

  return digIntoState(others, state[firstProperty]);
}

// expands a property path string to an object, and
// updates the state
export function updateNestedStateForProperty(property, value, context) {
  const newPartialState = propertyToObject(property, value);
  context.setState(newPartialState);
}

// converts a.property.path, targetValue to
// { a: { property: { path: targetValue}}
export function propertyToObject(propertyPath, targetValue) {
  const properties = propertyPath.split('.');
  const lastProperty = properties[properties.length - 1];

  return properties.reduceRight((accumulator, key) => {
    const o = {};
    o[key] = accumulator;

    if (key === lastProperty) o[key] = targetValue;

    return o;
  }, {});
}
