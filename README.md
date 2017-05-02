# React State Helpers
[![Build Status](https://travis-ci.org/NullVoxPopuli/react-state-helpers.svg?branch=master)](https://travis-ci.org/NullVoxPopuli/react-state-helpers)
[![Code Climate](https://codeclimate.com/github/NullVoxPopuli/react-state-helpers/badges/gpa.svg)](https://codeclimate.com/github/NullVoxPopuli/react-state-helpers)

## Installation

```bash
yarn add react-state-helpers
```

## Mut Usage

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
    const {
      mut,
      state: { someKey }
    } = this;

    return (
      <input
        type='text'
        value={someKey}
        onChange={mut('someKey')} />
    );
  }
}
```

## Toggle Usage

```js
import React, { Component } from 'react';
import { toggleCreator } from 'react-state-helpers';
import { Modal, Button } from 'reactstrap'; // external package

export default class Example extends Component {
  constructor(props) {
    super(props);

    this.state = { showModal: false };

    // need to create the helper;
    this.toggle = toggleCreator(this);
  }

  render() {
    const {
      toggle,
      state: { showModal }
    } = this;

    return (
      <div>
        <Button onClick={toggle('showModal')}>Open</Button>
        <Modal isOpen={showModal}>
          <Button onClick={toggle('showModal')}>{'Cancel'}</Button>
        </Modal>
      </div>
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

```js
import { Field } from 'redux-form';
// ... in render
<Field
  name='firstName'
  component='input'
  type='text' />
<Field
  name='lastName'
  component='input'
  type='text' />
// ...
export default reduxForm({ form: 'formname' })(MyComponent);
```

### After

no reliance on redux!

```js
import { mutCreator } from 'react-state-helpers';
// ... in constructor
this.mut = mutCreator(this);
// ... in render
const {
  mut,
  state: { firstName, lastName }
} = this;
// ... still in render
<input
  value={firstName}
  onChange={mut('firstName')}
  type='text' />
<input
  value={lasteName}
  onChange={mut('lasteName')}
  type='text' />
```
