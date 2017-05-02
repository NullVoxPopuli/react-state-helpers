# React State Helpers

## Installation

```bash
yarn add react-state-helpers
```

## Usage

```js
import React, { Component } from 'react';
import { mutCreator } from 'react-state-helpers';

export default class Example extends Component {
  constructor(props) {
    super(props);

    this.state = { someKey: '' };

    // need to create the helper;
    this.mut = mutCreator(this);
  }

  render() {
    const { someKey } = this.state;

    const mut = this.mut;

    return (
      <input
        type='text'
        value={someKey}
        onChange={mut('someKey')} />
    );
  }
}
```

## Available Functions

 - findValue
   - takes an event or value and returns the value.
   - useful, if you want a common interface for handling events.

```js
  handleChange(e) {
    const value = findValue(e);
    this.setState({ someKey: value });
  }

  // in render...
  <input value={someKey} onChange={handleChange} />
```

 - mutCreator
   - creates a helper that provides a short-hand for setting a state value.


## Want to stop using redux-forms?

Most components don't need to use redux-forms, as many inputs don't need to change the state every `onChange`, `onKeyUp`, `onKeyDown` etc.

### Before

  todo

### After

  todo
