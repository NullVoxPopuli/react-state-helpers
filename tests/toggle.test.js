import React from 'react';
import { shallow, mount } from 'enzyme';
import expect from 'expect';

import { toggleCreator } from '../src/index';
import { ComponentStub, UsingMut } from './fixtures';

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
