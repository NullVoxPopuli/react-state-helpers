class LifeCycle {

  transform = value => value;
  beforeUpdate = [];
  afterUpdate = [];

  constructor(main, nextValue, opts = {}) {
    this.main = main;
    this.nextValue = nextValue;

    if (typeof opts === 'function') {
      this.transform = opts;
    } else if (typeof opts === 'object') {
      if (opts.beforeUpdate || opts.afterUpdate) {
        if (opts.transform) this.transform = opts.transform;
        this.beforeUpdate = this.ensureArray(opts.beforeUpdate);
        this.afterUpdate = this.ensureArray(opts.afterUpdate);
      }
    } else throw new Error('Illegal options supplied to cycle.');
  }

  doTransform = () => {
    const { transform, nextValue } = this;
    return transform(nextValue);
  }

  doPreUpdate = () => {
    const { beforeUpdate, nextValue } = this;
    if (beforeUpdate.length > 0) {
      return beforeUpdate
      .map(func => func.call(nextValue))
      .every(v => v);
    }

    return true;
  }

  doPostUpdate = () => {
    this.afterUpdate.map(func => func.call());
  }

  run = () => {
    const {
      main,
      nextValue,
      beforeUpdate,
      afterUpdate,
      doTransform,
      doPreUpdate,
      doPostUpdate,
    } = this;

    if (
    !beforeUpdate.every(func => typeof func === 'function') ||
    !afterUpdate.every(func => typeof func === 'function')
    ) {
      throw new Error('Expected all hooks to be typeof function');
    }

    const transformedValue = doTransform();

    let returnValue = nextValue;
    if (doPreUpdate()) {
      main(transformedValue);
      returnValue = transformedValue;
      doPostUpdate();
    }

    return returnValue;
  }

  ensureArray = item => [].concat(item);
}

export default function doLifeCycle(main, nextValue, opts = {}) {
  return new LifeCycle(main, nextValue, opts).run();
}
