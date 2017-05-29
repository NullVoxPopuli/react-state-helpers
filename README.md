# React State Helpers
[![npm version](https://badge.fury.io/js/react-state-helpers.svg)](https://badge.fury.io/js/react-state-helpers)
[![Build Status](https://travis-ci.org/NullVoxPopuli/react-state-helpers.svg?branch=master)](https://travis-ci.org/NullVoxPopuli/react-state-helpers)
[![Code Climate](https://codeclimate.com/github/NullVoxPopuli/react-state-helpers/badges/gpa.svg)](https://codeclimate.com/github/NullVoxPopuli/react-state-helpers)

## Installation

```bash
yarn add react-state-helpers
```

## Higher Order Component Wrapper

```js
import React, { Component } from 'react';
import wrapStateHelpers from 'react-state-helpers';

// login could be a function that takes on object with the keys:
// userName, and password
import { login } from 'src/api';

class Example extends Component {
  render() {
    const {
      handleSumbit, mut,
      values: { userName }
    } = this.props;

    return (
      <div>
        Welcome, { userName }!
        <form onSubmit={handleSumbit(login)}>
          <input name='userName' type='text' onChange={mut('userName')}/>
          <input name='password' type='password' />

          <input type='submit' value='Login' />
        </form>
      </div>
    )
  }
}

export default wrapStateHelpers(Example);
```

## Mut Usage

```js
import React, { Component } from 'react';
import { mutCreator } from 'react-state-helpers';

export default class Example extends Component {
  constructor(props) {
    super(props);

    this.state = { someKey: '', someNumber: 2 };

    // need to create the helper;
    this.mut = mutCreator(this);
  }

  render() {
    const {
      mut,
      state: { someKey, someNumber }
    } = this;

    return (
      <input
        type='text'
        value={someKey}
        onChange={mut('someKey')} />
      <input
        type='number'
        value={someNumber}
        onChange={mut('someNumber', parseInt)} />
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

## Shorthand Redux

With using redux as the source of data, the first paramater of `mut` becomes irrelevant.

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withValue } from 'react-state-helpers';

import * as actions from 'js/actions';

class Example extends Component {
  static propTypes = {
    someKey: PropTypes.string
  }

  render() {
    const { someKey, setSomeKey } = this.props;

    return (
      <input
        type='text'
        value={someKey}
        onChange={withValue(setSomeKey)} />
    );
  }
}

export default connect(
  state => ({
    someKey: state.somewhere.someKey
  }),
  dispatch => ({
    setSomeKey: bindActionCreators(actions.somewhere.setSomeKey, dispatch)
  })
)(Example)
```

## HandleSubmit Usage

```js
import React, { Component } from 'react';
import { handleSubmit } from 'react-state-helpers';
import * as actions from 'src/actions';

class Example extends Component {
  render() {
    const { login } = this.props;

    const submit = values => login(values.username, values.password);

    return(
      <form onSubmit={handleSumbit(submit)}>
        <input name='username' type='text' />
        <input name='password' type='password' />
        <button type='submit'>Login</button>
      </form>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({
    login() { dispatch(actions.login); }
  })
)(Example)
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
 - toggleCreator
   - creates a helper that will set a value in the state to its inverse.
 - handleSumbit
   - creates a helper that will pass in all form values to a callback function.

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
