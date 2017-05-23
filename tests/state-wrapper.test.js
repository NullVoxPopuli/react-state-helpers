import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import expect from 'expect';

import stateWrapper from '../src/index';

class TestEverything extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mutValue: '',
      toggleValue: false
    }
  }

  render() {
    const {
      state: { mutValue, toggleValue },
      props: { mut, toggle, withValue, findValue, handleSumbit }
    } = this;

    return (
      <div>
        <span dataMutTest>{mutValue}</span>
        <span dataToggleTest>{toggleValue}</span>
        <button dataToggleButton onClick={toggle('toggleValue')}>toggle button</button>
        <input dataMutInput type='text' value={mutValue} onChange={mut('mutValue')} />
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

    wrapper.find('[dataMutInput]').simulate('change', { target: { value: 'changed' } });
    wrapper.update();

    const state = wrapper.state();

    expect(state.mutValue).toEqual('changed');
  })
});

describe('toggle', () => {
  it('inverts the value', () => {
    const wrapper = mount(makeWrappedComponent());

    wrapper.find('[dataToggleButton]').simulate('click');
    wrapper.update();

    expect(wrapper.state().toggleValue).toEqual(true);
  });
});
