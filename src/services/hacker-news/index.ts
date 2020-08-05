import { Story, StoryId } from './types/Story';

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

  init = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      fetch('https://hacker-news.firebaseio.com/v0/newstories.json').then((response) => {
        response.json().then((ids) => {
          this.storyIds = ids;
          this.iterator = storyIterator(this.storyIds);
          resolve();
        }).catch((error) => {
          throw new Error(`Error parsing response: ${error}`);
        });
      }).catch((error) => {
        reject(`Error fetching new stories: ${error}`);
      });
    });
  };

  getNextStories = (count: number): Promise<StoryId[]> => {
    if (!this.iterator) {
      throw new Error('Must init the StoryService before using it.');
    }
    return getNextChunk(this.iterator, count);
  }

  getStory = (storyId: StoryId): Promise<Story> => {
    return new Promise((resolve, reject) => {
      fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`).then((response) => {
        response.json().then((story) => {
          const { title, by, time, url } = story;
          const ourStory: Story = {
            id: storyId,
            title,
            author: by,
            postedAt: time,
            url
          };
          resolve(ourStory);
        }).catch((error) => {
          throw new Error(`Error parsing response: ${error}`);
        });
      }).catch((error) => {
        reject(`Error fetching story ${storyId}: ${error}`);
      });
    });
  }
}
