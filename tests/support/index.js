import React, { Component } from 'react';
import { mount } from 'enzyme';
import stateWrapper from '../../src';

export function makeWrappedComponent() {
  return React.createElement(stateWrapper(TestEverything));
}

export function mountWithWrapper(component) {
  return mount(
    React.createElement(stateWrapper(component))
  );
}

export function change(wrapper, selector, target) {
  wrapper.find(selector).simulate('change', { target });
  wrapper.update();
}

export function click(wrapper, selector) {
  wrapper.find(selector).simulate('click');
  wrapper.update();
}

export function instanceOf(wrapper, component) {
  return wrapper.find(component).instance();
}

export function stateFor(wrapper, component) {
  return instanceOf(wrapper, component).getState();
}

export function propsFor(wrapper, component) {
  return instanceOf(wrapper, component).getProps();
}


class TestEverything extends Component {
  constructor(props) {
    super(props);

    this.state = { someWithValue: '', foundValue: '', someCheckboxWithValue: false };
  }

  componentDidMount() {
    this.props.setWrappingState({
      mutValue: 'initial mut value',
      toggleValue: false,
      mutTransformValue: 'initial mut transform value'
    });
  }

  getState = () => this.state;

  render() {
    const {
      state: { someWithValue, foundValue, someCheckboxWithValue },
      props: {
        mut, toggle, withValue, findValue, handleSubmit,
        values: { mutValue, toggleValue, mutTransformValue }
      }
    } = this;

    return (
      <div>
        {/* toggle */}
        <span data-test="ToggleTest">{toggleValue}</span>
        <button data-test="ToggleButton" onClick={toggle('toggleValue')}>toggle button</button>

        {/* withValue */}
        <span data-test="WithValueTest">{someWithValue}</span>
        <input data-test="WithValueInput" type='text'
          value={someWithValue}
          onChange={withValue(v => this.setState({ someWithValue: `hi: ${v}` }))} />

        {/* withValue on a checkbox */}
        <span data-test="WithValueCheckboxTest">{someCheckboxWithValue}</span>
        <input data-test="WithValueCheckboxInput" type='checkbox'
          checked={someCheckboxWithValue}
          onChange={withValue(v => this.setState({ someCheckboxWithValue: v}))} />


        {/* findValue */}
        <span data-test="FindValueTest">{foundValue}</span>
        <input data-test="FindValueInput" type='text'
          value={foundValue}
          onChange={e => this.setState({ foundValue: `hi: ${findValue(e)}` })} />
      </div>
    );
  }
}
