import React from 'react';
import { shallow, mount } from 'enzyme';
import expect from 'expect';

import { mutCreator } from '../src/index';
import { ComponentStub, UsingMut } from './fixtures';

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
