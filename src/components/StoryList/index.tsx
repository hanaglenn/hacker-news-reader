import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { StoryService } from '../../services/hacker-news/index';
import { StoryId } from '../../types/Story';
import StoryListItem from './StoryListItem';
import Spinner from '../Spinner/index';

import './story-list.css';

const STORY_CHUNK_SIZE = 30;
const LOAD_MORE_PIXELS_FROM_BOTTOM = 0;

export default function StoryList() {
  const [ storyService ] = useState<StoryService>(new StoryService());
  const [ stories, setStories ] = useState<StoryId[]>([]);
  const [ inited, setInited ] = useState<boolean>(false);

  const fetchStories = () => {
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
    <InfiniteScroll
      element="ul"
      className="story-list"
      loadMore={fetchStories}
      hasMore={true}
      loader={<Spinner key={Date.now()} />}
      threshold={LOAD_MORE_PIXELS_FROM_BOTTOM}
    >
      {stories.map(storyId => 
        <StoryListItem key={storyId} id={storyId} storyService={storyService} />
      )}
    </InfiniteScroll>
  ) : (
    <Spinner />
  );
}
