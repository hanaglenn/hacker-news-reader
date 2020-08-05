import React from 'react';

import StoryList from './StoryList/index';
import Header from './Header/index';

import './root.css';

export default function Root() {
  return (
    <>
      <Header />
      <StoryList />
    </>
  );
}
