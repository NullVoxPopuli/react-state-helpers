# React State Helpers
[![npm version](https://badge.fury.io/js/react-state-helpers.svg)](https://badge.fury.io/js/react-state-helpers)
[![Build Status](https://travis-ci.org/NullVoxPopuli/react-state-helpers.svg?branch=master)](https://travis-ci.org/NullVoxPopuli/react-state-helpers)
[![Code Climate](https://codeclimate.com/github/NullVoxPopuli/react-state-helpers/badges/gpa.svg)](https://codeclimate.com/github/NullVoxPopuli/react-state-helpers)

## Installation

```bash
yarn add react-state-helpers
```

## Higher Order Component Wrapper

You can add `react-state-helpers` to any project quickly and easily with the supplied decorator.

```js
import React, { Component } from 'react';
import wrapStateHelpers from 'react-state-helpers';

// login could be a function that takes on object with the keys:
// userName, and password
import { login } from 'src/api';

@wrapStateHelpers
export default class Example extends Component {
  state = { userName: 'user' }

  render() {
    const {
      handleSubmit, mut,
      // default state values are copied to this values props.
      values: { userName }
    } = this.props;

    return (
      <div>
        Welcome, { userName }!
        <form onSubmit={handleSubmit(login)}>
          <input name='userName' type='text' onChange={mut('userName')}/>
          <input name='password' type='password' />

          <input type='submit' value='Login' />
        </form>
      </div>
    )
  }
}
```

If you are on an older version of Javascript you can use the following syntax for the same results...

```js
import React, { Component } from 'react';
import wrapStateHelpers from 'react-state-helpers';

class Example extends Component {
  // ... methods are the same
}
export default wrapStateHelpers(Example);
```

## Mut Usage

_Arguments_:  
`string (string)`: The name of the mutating property as it appears in the component state.  
`[function = () => {}] (function)`: A preprocessing function

```js
import React, { Component } from 'react';
import wrapStateHelpers from 'react-state-helpers';

@wrapStateHelpers
export default class Example extends Component {
  // Set the default state without a constructor
  state = { someKey: '', someNumber: 2 }

  render() {
    // mut is a part of the props that wrapStateHelpers brings in.
    const {
      props: {
        mut,
        values: { someKey, someNumber }
      }
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

_Arguments_:  
`string (string)`: The name of property to be toggled as it appears in the component state.

```js
import React, { Component } from 'react';
import wrapStateHelpers from 'react-state-helpers';
import { Modal, Button } from 'reactstrap'; // external package

@wrapStateHelpers
export default class Example extends Component {
  state = { showModal: false }

  render() {
    const {
      props: {
        toggle,
        values: { showModal }
      },
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

## HandleSubmit Usage

_Arguments_:

`function (function)`: The handler function for submitting a form.

```js
import React, { Component } from 'react';
import wrapStateHelpers from 'react-state-helpers';
import * as actions from 'src/actions';

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  login() {
    dispatch(actions.login);
  }
});

@connect(mapStateToProps, mapDispatchToProps)
@wrapStateHelpers
class Example extends Component {
  render() {
    const { login, handleSubmit } = this.props;

    const submit = values => login(values.username, values.password);

    return(
      <form onSubmit={handleSubmit(submit)}>
        <input name='username' type='text' />
        <input name='password' type='password' />
        <button type='submit'>Login</button>
      </form>
    );
  }
}
```

## Shorthand Redux

With using redux as the source of data, the first paramater of `mut` becomes irrelevant.

_Arguments:_

`function (function)`: A redux action that accepts the value of the input as a parameter

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import wrapStateHelpers from 'react-state-helpers';

import * as actions from 'js/actions';

const mapStateToProps = state => ({
  someKey: state.somewhere.someKey
});

const mapDispatchToProps = dispatch => ({
  setSomeKey: bindActionCreators(actions.somewhere.setSomeKey, dispatch)
});

// Chaining decorators is super easy!
@connect(mapStateToProps, mapDispatchToProps)
@wrapStateHelpers
export default class Example extends Component {
  static propTypes = {
    someKey: PropTypes.string
  }

  render() {
    const { someKey, setSomeKey, withValue } = this.props;

    return (
      <input
        type='text'
        value={someKey}
        onChange={withValue(setSomeKey)} />
    );
  }
}
```

## Available Functions

These functions can be found in your components props after using `wrapStateHelpers`

 - findValue
   - takes an event or value and returns the value.
   - useful, if you want a common interface for handling events.
     -  ex:
        ```js
        handleChange(e) {
          const value = findValue(e);
          this.setState({ someKey: value });
        }

        // in render...
        <input value={someKey} onChange={handleChange} />
        ```
 - mut
   - provides a short-hand for setting a state value.
 - toggle
   - set a value in the state to its inverse.
 - handleSubmit
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
import wrapStateHelpers from 'react-state-helpers';
// ... before class declaration
@wrapStateHelpers
// ... in render
const {
  props: { mut },
  state: { firstName, lastName }
} = this;
// ... still in render
<input
  value={firstName}
  onChange={mut('firstName')}
  type='text' />
<input
  value={lasteName}
  onChange={mut('lastName')}
  type='text' />
```
