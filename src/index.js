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

export function toggleCreator(context) {
  return property => _event => {
    const value = !digIntoState(property, context.state);
    updateNestedStateForProperty(property, value, context);

    return value;
  };
}

// NOTE: typeof form.elements === 'object'
//
// form.elements is an object that acts like an array.
// it has keys of 0..numberOfInputs in addition to key: value,
// entries that match the input name attributes with their
// corresponding value.
//
// form.elements.length returns the number of input elements
// including select, radio, checkboxes, and submit inputs.
//
// something to keep in mind, is that the key-value part of
// form.elements is built off the name attribute, so if an input
// doesn't have a name attribute (like a submit input), it will
// appear as "": "Submit Text"
export function handleSumbit(func) {
  return e => {
    e.preventDefault();

    const form = e.target;
    const elements = form.elements;
    const numElements = elements.length;
    let values = {};

    for (let i = 0; i < numElements; i += 1) {
      const input = elements[i];
      const isValueIgnored = (input.type === 'radio' && !input.checked);

      // radio buttons must have a value, and therefore we don't
      // care about them if they aren't checked.
      if (!isValueIgnored) {
        const value = valueOfInput(input);

        values = { ...values, [input.name]: value };
      }
    }

    return func(values);
  };
}

export function withValue(func) {
  return e => {
    const value = findValue(e);

    return func(value);
  };
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

function valueOfInput(input) {
  if (input.type === 'checkbox' && !input.value) return input.checked;
  if (input.type === 'radio') return input.value;

  return input.value;
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
