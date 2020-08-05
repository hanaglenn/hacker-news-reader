import React, { useState, useEffect } from 'react';

import { StoryService } from '../../services/hacker-news/index';
import { StoryId } from '../../types/Story';
import StoryListItem from './StoryListItem';

import './story-list.css';

export default function StoryList() {
  const [ storyService ] = useState<StoryService>(new StoryService());
  const [ stories, setStories ] = useState<StoryId[]>([]);
  useEffect(() => {
    storyService.init().then(() => {
      storyService.getNextStories(30).then((moreStories) => {
        setStories(moreStories);
      });
    });
  }, []);
  return (<ul className="story-list">
    {stories.map(storyId =>
      <StoryListItem key={storyId} id={storyId} storyService={storyService} />
    )}
  </ul>);
}
