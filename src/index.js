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
export function mutCreator(context) {
  return property => e => {
    const value = findValue(e);
    updateNestedStateForProperty(property, value, context);

    return value;
  };
}

export function toggleCreator(context) {
  return property => e => {
    const value = !digIntoState(property, context.state);
    updateNestedStateForProperty(property, value, context);

    return value;
  }
}

// -----------------------
// various helpers
// -----------------------
export function findValue(e) {
  if (e === undefined || e === null) return null;
  if (e.target && (e.target.value || e.target.value === '')) return e.target.value;
  if (e.value) return e.value;

  return e;
}

// given a string.object.notation, this will
// crawl the state object tree, and return the value of
// the right most property.
function digIntoState(property, state) {
  const properties = property.split('.');
  const firstProperty = properties[0];
  const others = properties.slice(1)[0];

  if (others === undefined) return state[firstProperty];

  return digIntoState(others, state[firstProperty]);
}

// expands a property path string to an object, and
// updates the state
function updateNestedStateForProperty(property, value, context) {
  const newPartialState = propertyToObject(property, value);
  context.setState(newPartialState);
}

// converts a.property.path, targetValue to
// { a: { property: { path: targetValue}}
function propertyToObject(propertyPath, targetValue) {
  const properties = propertyPath.split('.');
  const lastProperty = properties[properties.length - 1];

  return properties.reduceRight((accumulator, key) => {
    const o = {};
    o[key] = accumulator;

    if (key === lastProperty) o[key] = targetValue;

    return o;
  }, {});
}
