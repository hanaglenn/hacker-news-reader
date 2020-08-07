import { Story, StoryId } from '../../types/Story';

import { getNextChunk } from '../utils/get-next-chunk';

const STORY_TYPE = 'story';

// This function will return the next valid story id,
// searching into the past from the 'fromId'.
//
// This can be horribly inefficient since most 'items' are 
// not stories; there are way more comments, for example.
async function getNextStoryId(fromId: StoryId): Promise<number | undefined> {
  let item;
  let currId = fromId;
  while (currId >= 0) {
    try {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${currId}.json`);
      item = await response.json();
    } catch(error) {
      throw new Error(`Error fetching story ${currId}: ${error}`);
    }

    if (item && item.type === STORY_TYPE) {
      return item.id;
    }
    currId--;
  }
}

async function* storyIterator(initialList: StoryId[]): AsyncIterator<StoryId> {
  if (initialList.length === 0) {
    throw new Error('Must provide an initial list of storyIds to storyIterator.');
  }

  // This has to be initialized to make the currId-- below happy,
  // but we guarantee it will 
  let currId = 0;
  for (let i = 0; i < initialList.length; i++) {
    currId = initialList[i];
    yield currId;
  }

  // Get next older Id.
  currId--;

  while(currId > 0) {
    const storyId = await getNextStoryId(currId) || 0;
    currId = storyId - 1;
    if (storyId > 0) {
      yield storyId;
    }
  }
}

class StoryService {
  storyIds: StoryId[];
  iterator?: AsyncIterator<StoryId>;
  chunkSize: number;

  constructor(chunkSize: number) {
    this.storyIds = [];
    this.chunkSize = chunkSize;
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

  getNextStories(): Promise<StoryId[]> {
    if (!this.iterator) {
      throw new Error('Must init the StoryService before using it.');
    }
    return getNextChunk(this.iterator, this.chunkSize);
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

export default StoryService;
