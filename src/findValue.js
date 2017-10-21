export function findValue(e) {
  if (e === undefined || e === null) return null;

  const target = e.target;

  if (target) {
    const { checked, value } = target;

    if (checked !== undefined) {
      const valueEmpty = (
        value === null ||
        value === undefined ||
        value === ''
      );

      return (
        checked && !valueEmpty && value
      ) || checked;
    }

    if (value || value === '') return value;
  }

  if (e.value) return e.value;

  return e;
}
