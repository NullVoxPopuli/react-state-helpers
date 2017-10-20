export function findValue(e) {
  if (e === undefined || e === null) return null;

  const target = e.target;

  if (target) {
    const { checked, value } = target;

    if (checked !== undefined) {
      return (checked && value) || checked;
    }

    if (value || value === '') return value;
  }

  if (e.value) return e.value;

  return e;
}
