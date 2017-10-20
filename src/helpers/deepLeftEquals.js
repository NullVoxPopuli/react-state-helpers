// recursively checks if newObject's keys exist in
// sourceObject and they all have the same value.
//
// if sourceObject has extra keys, that doesn't matter.

const isArray = Array.isArray;
// NOTE: arrays are also objects
const isObject = o => (o instanceof Object);
const isTrue = o => o === true;

export function deepLeftEquals(a, b) {
  if (a === b) return true;

  if (isArray(a) && isArray(b)) return arrayExactlyEquals(a, b);
  else if (isObject(a) && isObject(b)) return objectKVPairsEqualTargetKVPairs(a, b);

  return false;
}

// here is where we don't care about b having extra keys
function objectKVPairsEqualTargetKVPairs(a, b) {
  return Object.keys(a)
               .map(key => deepLeftEquals(a[key], b[key]))
               .every(isTrue);
}


function arrayExactlyEquals(a, b) {
  if (!equalLength(a, b)) return false;

  return a.map((ae, i) => deepLeftEquals(ae, b[i]))
          .every(isTrue);
}

function equalLength(a, b) {
  return a.length === b.length;
}
