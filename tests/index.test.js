import 'babel-polyfill';
import 'jsdom-global/register';
import React, { Component } from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });
