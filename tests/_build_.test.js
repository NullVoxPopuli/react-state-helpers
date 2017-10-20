import stateWrapper, {
  withValue, findValue,
  mutCreator, toggleCreator,
  handleSubmit
} from '../dist';

import expect from 'expect';

describe('build (yarn compile) - make sure things compiled right', () => {
  it('defines stateWrapper', () => expect(stateWrapper).toNotEqual(undefined));
  it('defines withValue', () => expect(withValue).toNotEqual(undefined));
  it('defines findValue', () => expect(findValue).toNotEqual(undefined));
  it('defines mutCreator', () => expect(mutCreator).toNotEqual(undefined));
  it('defines toggleCreator', () => expect(toggleCreator).toNotEqual(undefined));
  it('defines handleSubmit', () => expect(handleSubmit).toNotEqual(undefined));
});
