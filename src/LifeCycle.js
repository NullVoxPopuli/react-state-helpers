export default function doLifeCycle(main, nextValue, opts = {}) {
  let transform;
  let beforeUpdate;
  let afterUpdate;

  const defaults = {
    transform: value => value,
    beforeUpdate: [() => true],
    afterUpdate: [],
  };

  if (typeof opts === 'function') {
    transform = opts;
    beforeUpdate = [() => true];
    afterUpdate = [];
  } else if (typeof opts === 'object') {
    if (opts.beforeUpdate || opts.afterUpdate) {
      const options = [...defaults, ...opts];

      transform = options.transform ? options.transform : value => value;
      beforeUpdate = [() => true].concat(options.beforeUpdate);
      afterUpdate = [].concat(options.afterUpdate);
    } else {
      ({ transform, beforeUpdate, afterUpdate } = defaults);
    }
  } else throw new Error('Illegal options supplied to cycle.');

  return run(main, nextValue, transform, beforeUpdate, afterUpdate);
}

function doTransform(transform, nextValue) {
  return transform(nextValue);
}

function doPreUpdate(before, nextValue) {
  return before
  .map(func => func.call(nextValue))
  .every(v => v);
}

function afterUpdate(currentValue, after) {
  after.map(func => func.call(currentValue));
}

function run(main, nextValue, transform, before, after) {
  if (
  !before.every(func => typeof func === 'function') ||
  !after.every(func => typeof func === 'function')
  ) {
    throw new Error('Expected all hooks to be typeof function');
  }

  const transformedValue = doTransform(transform, nextValue);

  let returnValue = nextValue;
  if (doPreUpdate(before, nextValue)) {
    main(transformedValue);
    returnValue = transformedValue;
    afterUpdate(returnValue, after);
  }

  return returnValue;
}
