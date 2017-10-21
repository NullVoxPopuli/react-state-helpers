// testing actual DOM event attributes
// https://jsfiddle.net/rv5msf8c/
export function findValue(e) {
  if (e === undefined || e === null) return null;

  const target = e.target;

  if (target) {
    const { checked, value, type, attributes } = target;
    const checkable = (type === 'checkbox' || type === 'radio');

    if (checked !== undefined && checkable) {
      const valueEmpty = (
        value === null ||
        value === undefined ||
        value === ''
      );

      if (checked && !valueEmpty) return value;

      return checked;
    }

    if (value || value === '') return value;
  }

  if (e.value) return e.value;

  return e;
}
