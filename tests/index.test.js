import 'babel-polyfill';
import 'jsdom-global/register';
import React, { Component } from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { shallow, mount } from 'enzyme';
import expect from 'expect';
import merge from 'deepmerge';


import {
  mutCreator, toggleCreator,
  findValue, withValue, handleSumbit
} from '../src/index.js';


// fixtures...
class UsingMut extends Component {
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

class ComponentStub {
  constructor(initialState = {}) {
    this.state = initialState || {};
  }

  setState(obj) {
    this.state = merge(this.state, obj);
  }
}

const Actions = {
  submit: expect.createSpy(),
}

class FormComponent extends Component{
  constructor(props){
    super(props);

    this.state = {};
  }

  render(){
    return(
      <form onSubmit={handleSumbit(Actions.submit)}>
        <input name='testInput' type='text' defaultValue='value' />
        <div>
          <input name='nestedInput' type='text' defaultValue='nestedValue' />
        </div>
        <select name='testSelect'>
          <option value='test1'>Test 1</option>
        </select>
        <textarea name='testTextArea' rows='4' cols='50' defaultValue='Test' />
        <button type='sumbit'>Submit</button>
      </form>
    );
  }
}


// actual tests...
describe('withValue', () => {
  it('takes a function', () => {
    const result = withValue(val => val * 2)({ target: { value: 4 }})

    expect(result).toEqual(8);
  });
});

describe('mutCreator', () => {
  describe('it transforms', () => {
    it('takes a function', () => {
      const fake = new ComponentStub();
      const mut = mutCreator(fake);
      const result = mut('two', parseInt)('2');

      expect(typeof result).toEqual('number');
      expect(result).toEqual(2);
    });

    it('takes a function, and returns a float', () => {
      const fake = new ComponentStub();
      const mut = mutCreator(fake);
      const result = mut('two', parseFloat)('2.2');

      expect(typeof result).toEqual('number');
      expect(result).toEqual(2.2);
    });

    it('takes an anonymous function', () => {
      const fake = new ComponentStub();
      const mut = mutCreator(fake);
      const result = mut('two', value => parseInt(value, 10))('2');

      expect(typeof result).toEqual('number');
      expect(result).toEqual(2);
    });
  });

  describe('with a React Component', () => {
    it('renders the default state', () => {
      const wrapper = shallow(<UsingMut />);
      expect(wrapper.find('.root').text()).toEqual('rootValue');
      expect(wrapper.find('.deep').text()).toEqual('deepValue');
    });

    it('changes a 1st level value', () => {
      const wrapper = shallow(<UsingMut />);
      wrapper.find('#root').simulate('change', { target: { value: 'changed' } });
      wrapper.update();

      const state = wrapper.state();

      expect(state.rootKey).toEqual('changed');
      expect(state.object.nestedObject.deepKey).toEqual('deepValue');
    });

    it('changes a deep value', () => {
      const wrapper = shallow(<UsingMut />);
      wrapper.find('#deep').simulate('change', { target: { value: 'changed' } });
      wrapper.update();

      const state = wrapper.state();

      expect(state.object.nestedObject.deepKey).toEqual('changed');
      expect(state.rootKey).toEqual('rootValue');
    });
  });
});

describe('toggleCreator', () => {
  describe('with a React Component', () => {
    it('toggles the value', () => {
      const wrapper = shallow(<UsingMut />);
      const btn = wrapper.find('button');

      expect(wrapper.state().boolName).toEqual(false);

      btn.simulate('click');
      wrapper.update();

      expect(wrapper.state().boolName).toEqual(true);

      btn.simulate('click');
      wrapper.update();

      expect(wrapper.state().boolName).toEqual(false);
    });
  });

  describe('the returned event handling function', () => {
    it('returns true when the value is undefined', () => {
      const fake = new ComponentStub();
      const toggle = toggleCreator(fake);
      const result = toggle('val')();

      expect(result).toEqual(true);
    });

    it('returns true when the value is false', () => {
      const fake = new ComponentStub();
      const toggle = toggleCreator(fake);

      fake.setState({ val: false });

      expect(fake.state.val).toEqual(false);

      const result = toggle('val')();

      expect(result).toEqual(true);
      expect(fake.state.val).toEqual(true);
    });

    it('returns false when the value is true', () => {
      const fake = new ComponentStub({val: true});
      const toggle = toggleCreator(fake);

      expect(fake.state.val).toEqual(true);

      const result = toggle('val')();

      expect(result).toEqual(false);
      expect(fake.state.val).toEqual(false);
    });
  });
});

describe('handleSumbit', () => {
  describe('with React Component', () => {

    let wrapper;
    let submit;

    beforeEach(() => {
      wrapper = mount(<FormComponent />);
      submit = expect.spyOn(Actions, 'submit');

      wrapper.find('button').get(0).click();
    });

    afterEach(() => {
      expect.restoreSpies();
    })

    it('returns a value for an input', () => {
      expect(Actions.submit.calls[0].arguments[0].testInput).toEqual('value');
    });

    it('returns a value for a nested input', () => {
      expect(Actions.submit.calls[0].arguments[0].nestedInput).toEqual('nestedValue');
    });

    it('returns a value for a select', () => {
      expect(Actions.submit.calls[0].arguments[0].testSelect).toEqual('test1');
    });

    it('returns a value for textarea', () => {
      expect(Actions.submit.calls[0].arguments[0].testTextArea).toEqual('Test');
    });
  })
});
