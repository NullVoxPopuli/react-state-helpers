export function findValue(e) {
  if (e === undefined || e === null) return null;

  if (e.target) {
    if (e.target.value || e.target.value === '') return e.target.value;
    if (e.target.checked !== undefined) return e.target.checked;
  }

  if (e.value) return e.value;

  return e;
}
