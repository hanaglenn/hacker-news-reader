import React from 'react';
import { shallow, mount } from 'enzyme';

import StoryList from '../../../src/components/StoryList/index';

describe('StoryList component', () => {
  describe('init', () => {
    test('should render a Spinner before inited', () => {
      const storyList = shallow(<StoryList />);
      expect(storyList.find('Spinner').length).toEqual(1);
    });

    // Would continue here testing more side effects with more time. :)
  });
});
