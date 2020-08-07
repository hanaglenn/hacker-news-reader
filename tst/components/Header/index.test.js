import React from 'react';
import { shallow } from 'enzyme';

import Header from '../../../src/components/Header/index';

describe('Header component', () => {
  test('should render a header', () => {
    const header = shallow(<Header title="" />);
    expect(header.find('header').length).toEqual(1);
  });

  test('should render an h1 with title in the header', () => {
    const header = shallow(<Header title="random" />);
    expect(header.find('header').find('h1').text()).toEqual("random");
  });
});
