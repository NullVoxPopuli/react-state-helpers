import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import expect from 'expect';

import { handleSubmit } from '../src/index';

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
      <form onSubmit={handleSubmit(Actions.submit)}>
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


describe('handleSubmit', () => {
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
