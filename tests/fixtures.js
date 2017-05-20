import React, { Component } from 'react';
import merge from 'deepmerge';

import {
  mutCreator, toggleCreator,
  findValue, withValue, handleSumbit
} from '../src/index.js';


// fixtures...
export class UsingMut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      boolName: false,
      rootKey: 'rootValue',
      object: {
        nestedObject: {
          deepKey: 'deepValue'
        }
      }
    }
    this.mut = mutCreator(this);
    this.toggle = toggleCreator(this);
  }

  render() {
    const { rootKey, object: { nestedObject: { deepKey } } } = this.state;
    const { mut, toggle } = this;

    return (
      <div>
        <span className='root'>{rootKey}</span>
        <span className='deep'>{deepKey}</span>
        <button onClick={toggle('boolName')}>btn</button>
        <input
          id='root'
          type='text'
          value={rootKey}
          onChange={mut('rootKey')} />
        <input
          id='deep'
          type='text'
          value={deepKey}
          onChange={mut('object.nestedObject.deepKey')} />
      </div>
    );
  }
}

export class ComponentStub {
  constructor(initialState = {}) {
    this.state = initialState || {};
  }

  setState(obj) {
    this.state = merge(this.state, obj);
  }
}
