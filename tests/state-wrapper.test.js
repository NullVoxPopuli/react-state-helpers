import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import expect from 'expect';

import stateWrapper from '../src/index';

import {
  makeWrappedComponent, mountWithWrapper,
  change, click, instanceOf,
  stateFor, propsFor
} from './support';

describe('setWrappingState', () => {
  describe('in componentDidMount', () => {
    it('can set multiple properties', () => {
      const wrapper = mountWithWrapper(class extends Component {
        componentDidMount() {
          this.props.setWrappingState({
            mutValue: 'initial mut value',
            toggleValue: false,
            mutTransformValue: 'initial mut transform value'
          });
        }
        render = () => null
      });
      const props = wrapper.state()

      expect(props.mutValue).toEqual('initial mut value');
      expect(props.toggleValue).toEqual(false);
      expect(props.mutTransformValue).toEqual('initial mut transform value');
    });
  })

  describe('in componentWillReceiveProps', () => {
    it('can set multiple properties', () => {
      class TC extends Component {
        componentWillReceiveProps(nextProps) {
          nextProps.setWrappingState({ something: nextProps.something });
        }
        render = () => null;
        getState = () => this.state;
      }

      const wrapper = mountWithWrapper(TC);

      wrapper.setProps({ something: 3 });
      wrapper.update();

      const result = wrapper.state().something;

      expect(result).toEqual(3);
    });

    it('does not infinite loop with passing nextProps', () => {
      class TC extends Component {
        componentWillReceiveProps(nextProps) {
          nextProps.setWrappingState(nextProps);
        }
        render = () => null;
        getState = () => this.state;
      }
      const wrapper = mountWithWrapper(TC);

      // setting props should trigger componentWillReceiveProps,
      // via the wrapping render method's prop-forwarding,
      // which triggers the sub-component's componentWillReceiveProps,
      // which in-turn triggers setWrappingState
      wrapper.setProps({ something: 2 });
      wrapper.update();

      const result = wrapper.state().something;

      expect(result).toEqual(2);
    });
  });
});

describe('mut', () => {
  describe('changes the value', () => {
    class TC extends Component {
      getProps = () => this.props;
      render = () => <input type='text' onChange={this.props.mut('mutValue')} />
    }

    it('in the wrapper', () => {
      const wrapper = mountWithWrapper(TC);

      change(wrapper, 'input', { value: 'changed' });

      const state = wrapper.state();

      expect(state.mutValue).toEqual('changed');
    });

    it('and passes it via values', () => {
      const wrapper = mountWithWrapper(TC);

      change(wrapper, 'input', { value: 'changed' });

      const props = propsFor(wrapper, TC);
      expect(props.values.mutValue).toEqual('changed');
    });
  });

  describe('transforms a value', () => {
    class TC extends Component {
      getProps = () => this.props;
      render = () => <input type='text' onChange={this.props.mut('mutValue', parseInt)} />
    }

    it('in the wrapper', () => {
      const wrapper = mountWithWrapper(TC);

      change(wrapper, 'input', { value: '2.3' });

      expect(wrapper.state().mutValue).toEqual(2);
    });

    it('and passes it via values', () => {
      const wrapper = mountWithWrapper(TC);

      change(wrapper, 'input', { value: '2.3' });

      expect(
        propsFor(wrapper, TC).values.mutValue
      ).toEqual(2);
    });
  });
});

describe('toggle', () => {
  describe('inverts the value', () => {
    class TC extends Component {
      getProps = () => this.props;
      render() {
        const { toggle, values: { toggled} } = this.props;
        return <button onClick={toggle('toggled')}>button</button>;
      }
    }

    it('initializes to undefined', () => {
      const wrapper = mountWithWrapper(TC);

      expect(wrapper.state().toggled).toEqual(undefined);
    })

    it('in the wrapper', () => {
      const wrapper = mountWithWrapper(TC);

      click(wrapper, 'button');

      expect(wrapper.state().toggled).toEqual(true);
    });

    it('and passes it via values', () => {
      const wrapper = mountWithWrapper(TC);

      click(wrapper, 'button');

      expect(propsFor(wrapper, TC).values.toggled).toEqual(true);
    })
  });
});

describe('withValue', () => {
  class TC extends Component {
    getProps = () => this.props;
    getState = () => this.state;
    render() {
      const { withValue } = this.props;

      return <input
        type='text'
        onChange={withValue(v => this.setState({ someValue: `hi ${v}` }))}
      />
    }
  }

  it('in the wrapper', () => {
    const wrapper = mountWithWrapper(TC);

    change(wrapper, 'input', { value: 'something' });

    expect(stateFor(wrapper, TC).someValue).toEqual('hi something');
  });

  it('and passes it via values', () => {
    const wrapper = mountWithWrapper(TC);

    change(wrapper, 'input', { value: 'something' });

    expect(stateFor(wrapper, TC).someValue).toEqual('hi something');
  });
});

describe('withValue - on a checkbox', () => {
  class TC extends Component {
    getProps = () => this.props;
    getState = () => this.state;
    render() {
      const { withValue, values: { someValue } } = this.props;

      return <input
        type='checkbox'
        checked={someValue}
        onChange={withValue(v => this.setState({ someValue: v }))}
      />
    }
  }

  it('changes the value', () => {
    const wrapper = mountWithWrapper(TC);

    change(wrapper, 'input', { type: 'checkbox', checked: true });

    const result = stateFor(wrapper, TC).someValue;
    expect(result).toEqual(true);
  });

  it('toggles the value', () => {
    const wrapper = mountWithWrapper(TC);

    change(wrapper, 'input', { type: 'checkbox', checked: true });
    change(wrapper, 'input', { type: 'checkbox', checked: false });

    let result = stateFor(wrapper, TC).someValue;
    expect(result).toEqual(false);

    change(wrapper, 'input', { type: 'checkbox', checked: true });

    result = stateFor(wrapper, TC).someValue;
    expect(result).toEqual(true);
  });

  it('does not return the value if the checkbox is not checked', () => {
    const wrapper = mountWithWrapper(TC);

    change(wrapper, 'input', { type: 'checkbox', checked: false, value: 'a' });

    let result = stateFor(wrapper, TC).someValue;
    expect(result).toEqual(false);

    change(wrapper, 'input', { type: 'checkbox', checked: true, value: 'a' });

    result = stateFor(wrapper, TC).someValue;
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
