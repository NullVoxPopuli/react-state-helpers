import { valueOfInput } from './helpers';

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
