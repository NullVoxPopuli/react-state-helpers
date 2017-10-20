import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import expect from 'expect';

import stateWrapper from '../src/index';

class TestEverything extends Component {
  constructor(props) {
    super(props);

    this.state = { someWithValue: '', foundValue: '', someCheckboxWithValue: false };
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

        {/* mut */}
        <span data-test="MutTest">{mutValue}</span>
        <input data-test="MutInput" type='text' value={mutValue} onChange={mut('mutValue')} />

        {/* mut with transform */}
        <span data-test="MutTransformTest">{mutTransformValue}</span>
        <input data-test="MutTransformInput" type='text'
          value={mutTransformValue}
          onChange={mut('mutTransformValue', parseInt)} />

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

function makeWrappedComponent() {
  return React.createElement(stateWrapper(TestEverything));
}

describe('mut', () => {
  it('changes a value', () => {
    const wrapper = mount(makeWrappedComponent());

    wrapper.find('[data-test="MutInput"]').simulate('change', { target: { value: 'changed' } });
    wrapper.update();

    const state = wrapper.state();

    expect(state.mutValue).toEqual('changed');
    expect(wrapper.find('[data-test="MutTest"]').text()).toEqual('changed');
  });


  it('transforms a value', () => {
    const wrapper = mount(makeWrappedComponent());

    wrapper.find('[data-test="MutTransformInput"]').simulate('change', { target: { value: '2.3' } });
    wrapper.update();

    const state = wrapper.state();

    expect(state.mutTransformValue).toEqual(2);
    expect(wrapper.find('[data-test="MutTransformTest"]').text()).toEqual('2');
  });
});

describe('toggle', () => {
  it('inverts the value', () => {
    const wrapper = mount(makeWrappedComponent());

    wrapper.find('[data-test="ToggleButton"]').simulate('click');
    wrapper.update();

    expect(wrapper.state().toggleValue).toEqual(true);
  });
});

describe('withValue', () => {
  it('changes the value', () => {
    const wrapper = mount(makeWrappedComponent());

    wrapper.find('[data-test="WithValueInput"]').simulate('change', { target: { value: 'someValue' } });
    wrapper.update();

    expect(wrapper.find('[data-test="WithValueTest"]').text()).toEqual('hi: someValue');
  });
});

describe('withValue - on a checkbox', () => {
  it('changes the value', () => {
    const wrapper = mount(makeWrappedComponent());

    wrapper.find('[data-test="WithValueCheckboxInput"]').simulate('change', { target: { checked: true } });
    wrapper.update();

    const result = wrapper.find(TestEverything).instance().getState().someCheckboxWithValue;
    expect(result).toEqual(true);
  });

  it('toggles the value', () => {
    const wrapper = mount(makeWrappedComponent());
    const selector = '[data-test="WithValueCheckboxInput"]';

    wrapper.find(selector).simulate('change', { target: { checked: true } });
    wrapper.update();
    wrapper.find(selector).simulate('change', { target: { checked: false } });
    wrapper.update();

    let result = wrapper.find(TestEverything).instance().getState().someCheckboxWithValue;
    expect(result).toEqual(false);

    wrapper.find(selector).simulate('change', { target: { checked: true } });
    wrapper.update();

    result = wrapper.find(TestEverything).instance().getState().someCheckboxWithValue;
    expect(result).toEqual(true);
  });

  xit('does not return the value if the checkbox is not checked', () => {
    // I don't think there this can be generalized for everyone's use cases
    const wrapper = mount(makeWrappedComponent());
    const selector = '[data-test="WithValueCheckboxInput"]';

    wrapper.find(selector).simulate('change', { target: { checked: false, value: 'a' } });
    wrapper.update();

    let result = wrapper.find(TestEverything).instance().getState().someCheckboxWithValue;
    expect(result).toEqual(false);

    wrapper.find(selector).simulate('change', { target: { checked: true, value: 'a' } });
    wrapper.update();

    result = wrapper.find(TestEverything).instance().getState().someCheckboxWithValue;
    expect(result).toEqual('a');
  });
});


describe('findValue', () => {
  it('is used to change the state', () => {
    const wrapper = mount(makeWrappedComponent());

    wrapper.find('[data-test="FindValueInput"]').simulate('change', { target: { value: 'aFoundValue' } });
    wrapper.update();

    expect(wrapper.find('[data-test="FindValueTest"]').text()).toEqual('hi: aFoundValue');
  });
});
