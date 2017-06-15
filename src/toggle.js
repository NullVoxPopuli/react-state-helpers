import { digIntoState, updateNestedStateForProperty } from './helpers';
import doLifeCycle from './LifeCycle';

export function toggleCreator(context) {
  return (property, opts) => _event => {
    const nextValue = !digIntoState(property, context.state);

    const updateState = () => {
      updateNestedStateForProperty(property, nextValue, context);
      return nextValue;
    };

    return doLifeCycle(updateState, nextValue, opts);
  };
}
