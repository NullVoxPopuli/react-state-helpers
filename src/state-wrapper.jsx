import React, { Component } from 'react';

import { withValue } from './withValue';
import { findValue } from './findValue';
import { mutCreator } from './mut';
import { toggleCreator } from './toggle';
import { handleSumbit } from './handleSubmit';

// Higher-Order-Component for adding all the functionality of
// react-state-helpers to a component
export function stateWrapper(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        stateHelpers: {
          mut: mutCreator(this),
          toggle: toggleCreator(this),
          withValue,
          findValue,
          handleSumbit,
        },
      };
    }

    render() {
      const props = {
        ...this.state.stateHelpers,
        ...this.props,
      };

      return <WrappedComponent {...props} />;
    }
  };
}
