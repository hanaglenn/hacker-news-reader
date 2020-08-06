import { Story, StoryId } from '../../types/Story';

import { getNextChunk } from '../utils/get-next-chunk';

function* storyIterator(initialList: StoryId[]): Iterator<StoryId> {
  let i = 0;
  while(true) {
    let currId = initialList[i++];
    yield currId;
  }
}

export class StoryService {
  storyIds: StoryId[];
  iterator?: Iterator<StoryId>;

  constructor() {
    this.storyIds = [];
  }

  async init(): Promise<void> {
    let ids;
    try {
      const response = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json');
      ids = await response.json();
    } catch (error) {
      throw new Error(`Error fetching new stories: ${error}`);
    }

    this.storyIds = ids;
    this.iterator = storyIterator(this.storyIds);
  }

  getNextStories(count: number): Promise<StoryId[]> {
    if (!this.iterator) {
      throw new Error('Must init the StoryService before using it.');
    }
    return getNextChunk(this.iterator, count);
  }

  async getStory(storyId: StoryId): Promise<Story> {
    let story;
    try {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
      story = await response.json();
    } catch(error) {
      throw new Error(`Error fetching story ${storyId}: ${error}`);
    }

    if (!story) {
      throw new Error('Story does not exist.');
    }

    const { title, by, time, url } = story;
    const ourStory: Story = {
      id: storyId,
      title,
      author: by,
      postedAt: time,
      url
    };
    return ourStory;
  }
}
