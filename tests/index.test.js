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

    this.state = { testSelect: 'test1', testRadio: 'test1' };
  }

  render(){
    const {
      testSelect,
      testRadio
    } = this.state;

    const onChange = () => {};

    return(
      <form onSubmit={handleSumbit(Actions.submit)}>
        <input id='testInput' name='testInput' type='text' defaultValue='value' />
        <div>
          <input id='nestedInput' name='nestedInput' type='text' defaultValue='nestedValue' />
        </div>
        <select id='testSelect' name='testSelect' value={testSelect}>
          <option>Please Select</option>
          <option value='test1'>Test 1</option>
          <option value='test2'>Test 2</option>
          <option value='test3'>Test 3</option>
        </select>
        <textarea id='testTextArea' name='testTextArea' rows='4' cols='50' defaultValue='A value for textarea' />

        <input id='testCheckBox' name='testCheckBox' type='checkbox' />
        <input id='testCheckBox2' name='testCheckBox2' value='yes' type='checkbox' defaultChecked />
        <div>
          <input name='testRadio' type='radio' value='test1'  checked={testRadio == 'test1'}/>
          <input id='testRadio1' name='testRadio' type='radio' value='test2' checked={testRadio == 'test2'}/>
          <input id='testRadio2' name='testRadio' type='radio' value='test3' checked={testRadio == 'test3'}/>
        </div>
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
  describe('default form values', () => {

    let wrapper;
    let submit;
    let submitArgs;

    beforeEach(() => {
      wrapper = mount(<FormComponent />);
      submit = expect.spyOn(Actions, 'submit');

      wrapper.find('button').get(0).click();

      submitArgs = Actions.submit.calls[0].arguments[0];
    });

    afterEach(() => {
      expect.restoreSpies();
      submit.reset();
    })

    it('returns the correct value for an input', () => {
      expect(submitArgs.testInput).toEqual('value');
    });

    it('returns the correct value for a nested input', () => {
      expect(submitArgs.nestedInput).toEqual('nestedValue');
    });

    it('returns the correct value for a select', () => {
      expect(submitArgs.testSelect).toEqual('test1');
    });

    it('returns the correct value for textarea', () => {
      expect(submitArgs.testTextArea).toEqual('A value for textarea');
    });

    it('returns the correct value for checkbox', () => {
      expect(submitArgs.testCheckBox).toEqual(false);
    });

    it('returns the correct value for checkbox', () => {
      expect(submitArgs.testCheckBox2).toEqual('yes');
    });

    it('returns the correct value for a radio group', () => {
      expect(submitArgs.testRadio).toEqual('test1');
    });
  });

  describe('with mutated values', () => {

    let wrapper;
    let submit;
    let submitArgs;

    // For the following tests:
    //  I've found that element.node.value = 'mut'; is a good universal way of
    //  programatically changing element values -- simulate doesn't work in some
    //  cases (namely TextArea).


    beforeEach(() => {
      wrapper = mount(<FormComponent />);
      submit = expect.spyOn(Actions, 'submit');

      wrapper.find('#testInput').node.value = 'ChangedTestInput';
      wrapper.find('#nestedInput').node.value = 'ChangedNestedInput';
      wrapper.find('#testSelect').node.value = 'test2';
      wrapper.find('#testTextArea').node.value='MutatedTest';
      wrapper.find('#testCheckBox').node.checked = false;
      wrapper.find('#testRadio1').node.checked = false;
      wrapper.find('#testRadio2').node.checked = true;

      wrapper.find('button').get(0).click();

      submitArgs = Actions.submit.calls[0].arguments[0];
    });

    afterEach(() => {
      expect.restoreSpies();
      submit.reset();
    })

    it('returns the correct value for input', () => {
      expect(submitArgs.testInput).toEqual('ChangedTestInput');
    });

    it('returns the correct value for nested input', () => {
      expect(submitArgs.nestedInput).toEqual('ChangedNestedInput');
    });

    it('returns the correct value for a mutated select', () => {
      expect(submitArgs.testSelect).toEqual('test2');
    });
    it('returns the correct value for mutated textarea', () => {
      expect(submitArgs.testTextArea).toEqual('MutatedTest');
    });

    it('returns the correct value for mutated checkbox', () => {
      expect(submitArgs.testCheckBox).toEqual(false);
    });

    it('returns the correct value for a mutated radio group', () => {
      expect(submitArgs.testRadio).toEqual('test3');
    });

  });

});
