import React, { useState, useEffect } from 'react';

import { StoryService } from '../../services/hacker-news/index';
import { Story, StoryId } from '../../types/Story';
import Spinner from '../Spinner/index';

type Props = {
  id: StoryId;
  storyService: StoryService;
}

export default function StoryListItem({ id, storyService }: Props) {
  const [ story, setStory ] = useState<Story>();
  const [ error, setError ] = useState<string>();

  useEffect(() => {
    storyService.getStory(id).then((story) => {
      setStory(story);
    }).catch((errorMessage) => {
      const error = `Could not find story with id ${id}: ${errorMessage}`;
      console.warn(error);
      setError(error);
    });
  }, []);

  // Don't render this item if we couldn't properly fetch it.
  if (error) {
    return null;
  }

  return (
    <li key={id}>
      {story
        ? <>
            <p>
              <a href={story.url} target="_blank">{story.title}</a>
            </p>
            <span className="small">by {story.author}, </span>
            <span className="small">{new Date(story.postedAt * 1000).toLocaleString()}</span>
          </>
        : <Spinner />
      }
    </li>
  );
}
