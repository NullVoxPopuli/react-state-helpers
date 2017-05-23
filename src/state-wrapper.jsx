import React, { Component } from 'react';

import { withValue } from './withValue';
import { findValue } from './findValue';
import { mutCreator } from './mut';
import { toggleCreator } from './toggle';
import { handleSumbit } from './handleSubmit';

function stateWrapper(WrappedComponent) {
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

export default stateWrapper;
