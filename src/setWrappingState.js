import { deepLeftEquals } from './helpers';

export function setWrappingStateCreator(context) {
  return nextState => {
    const originalState = context.state;
    // remove helper functions
    // NOTE: if anyone actually defines this and wants these set...
    //       uhhh.... they need better naming decisions...
    const {
      mut, toggle, withValue, findValue, handleSubmit, values,
      ...scrubbedState
    } = nextState;

    const shouldUpdate = !deepLeftEquals(scrubbedState, originalState);

    if (shouldUpdate) return context.setState(nextState);

    // otherwise, we have no need to update.
    // this prevents infinite loops when
    // setWrappingState is used within a function that
    // causes a re-render
    //
    // NOTE: if setWrappingState does any incrementing,
    //       an infinite loop will still occur
  };
}
