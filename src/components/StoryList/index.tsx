import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import StoryService from '../../services/hacker-news/StoryService';
import { StoryId } from '../../types/Story';
import StoryListItem from './StoryListItem';
import Spinner from '../Spinner/index';

import './story-list.css';

const STORY_CHUNK_SIZE = 25;

/*
 * This is set to load when the bottom of the page is hit,
 * as per the requirements, but can be increased in order to
 * more eagerly load additional stories.
 */
const LOAD_MORE_PIXELS_FROM_BOTTOM = 0;

export default function StoryList() {
  const [ storyService ] = useState<StoryService>(new StoryService(STORY_CHUNK_SIZE));
  const [ stories, setStories ] = useState<StoryId[]>([]);
  const [ inited, setInited ] = useState<boolean>(false);
  const [ hasMore, setHasMore ] = useState<boolean>(true);

  const fetchStories = () => {
    // The InfiniteScroll should also handle this, but just in case.
    if (!hasMore) {
      return;
    }

    storyService.getNextStories().then((moreStories) => {
      // This chunk was incomplete, which means there won't be any beyond it.
      if (moreStories && moreStories.length < STORY_CHUNK_SIZE) {
        setHasMore(false);
      }
      const newStories = stories.concat(moreStories);
      setStories(newStories);
    });
  }

  useEffect(() => {
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
      hasMore={hasMore}
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
