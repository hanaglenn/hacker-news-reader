import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { StoryService } from '../../services/hacker-news/index';
import { StoryId } from '../../types/Story';
import StoryListItem from './StoryListItem';
import Spinner from '../Spinner/index';

import './story-list.css';

const STORY_CHUNK_SIZE = 30;

export default function StoryList() {
  const [ storyService ] = useState<StoryService>(new StoryService());
  const [ stories, setStories ] = useState<StoryId[]>([]);
  const [ inited, setInited ] = useState<boolean>(false);

  const fetchStories = () => {
    console.log('fetching stories');
    storyService.getNextStories(STORY_CHUNK_SIZE).then((moreStories) => {
      const newStories = stories.concat(moreStories);
      setStories(newStories);
    });
  }

  useEffect(() => {
    // Init the story service and grab the first set of stories.
    storyService.init().then(() => {
      setInited(true);
    });
  }, []);

  return inited ?
  (
    <ul className="story-list">
      <InfiniteScroll
        pageStart={0}
        loadMore={fetchStories}
        hasMore={true}
        loader={<Spinner key={Date.now()} />}
      >
        {stories.map(storyId => 
          <StoryListItem key={storyId} id={storyId} storyService={storyService} />
        )}
      </InfiniteScroll>
    </ul>
  ) : (
    <Spinner />
  );
}
