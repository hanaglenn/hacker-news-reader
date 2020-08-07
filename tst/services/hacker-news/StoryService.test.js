import StoryService from '../../../src/services/hacker-news/StoryService';

const getFulfilledFetch = (response) => jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(response),
  })
);

const getRejectedFetch = (response) => jest.fn(() =>
  Promise.reject(response)
);

describe('StoryService', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  describe('getStory', () => {
    it('should return the story from response', async () => {
      global.fetch = getFulfilledFetch({
        title: 'randomTitle',
        by: 'randomAuthor',
        time: 0,
        url: 'random:url'
      });

      const service = new StoryService();
      const result = await service.getStory(1234)
      expect(result).toEqual({
        id: 1234,
        title: 'randomTitle',
        author: 'randomAuthor',
        postedAt: 0,
        url: 'random:url'
      });
    });

    it('should throw if no story is returned', async () => {
      global.fetch = getFulfilledFetch();

      const service = new StoryService();
      await expect(service.getStory(1234)).rejects.toThrow('Story does not exist.');
    });

    it('should throw if fetch fails', async () => {
      global.fetch = getRejectedFetch();

      const service = new StoryService();
      await expect(service.getStory(1234)).rejects.toThrow();
    });
  });

  describe('init', () => {
    it('should set initial story ids', async () => {
      global.fetch = getFulfilledFetch([1,2,3,4]);

      const service = new StoryService();

      await service.init();
      expect(service.storyIds).toEqual([1,2,3,4]);
    });
  });

  describe('getNextStories', () => {
    it('should throw if init is not called', (done) => {
      const service = new StoryService();

      try {
        service.getNextStories();
      } catch(error) {
        expect(error.message).toEqual('Must init the StoryService before using it.');
        done();
      }
    });

    it('should return next chunk of story ids', async () => {
      global.fetch = getFulfilledFetch([1,2,3,4]);

      const chunkSize = 2;
      const service = new StoryService(chunkSize);

      await service.init();
      const storyIds = await service.getNextStories();
      expect(storyIds).toEqual([1,2]);
    });

    it('should return subsequent chunks of story ids', async () => {
      global.fetch = getFulfilledFetch([1,2,3,4,5]);

      const chunkSize = 2;
      const service = new StoryService(chunkSize);

      await service.init();
      let storyIds = await service.getNextStories();
      expect(storyIds).toEqual([1,2]);

      storyIds = await service.getNextStories();
      expect(storyIds).toEqual([3,4]);

      storyIds = await service.getNextStories();
      expect(storyIds).toEqual([5]);
    });
  });
});
