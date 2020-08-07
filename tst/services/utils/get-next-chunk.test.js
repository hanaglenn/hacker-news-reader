import { getNextChunk } from '../../../src/services/utils/get-next-chunk';

const counter = async function* (count) {
  for (let i = 0; i < count; i++) {
    yield i;
  }
};

describe('get-next-chunk util', () => {
  it('should return empty elements from empty iterable', (done) => {
    const iterator = counter(0);
    getNextChunk(iterator, 3).then(results => {
      expect(results.length).toEqual(0);
      done();
    });
  });

  it('should return max elements from iterable if available', (done) => {
    const iterator = counter(5);
    getNextChunk(iterator, 3).then(results => {
      expect(results.length).toEqual(3);
      done();
    });
  });

  it('should return elements from the beginning of iterable', (done) => {
    const iterator = counter(5);
    getNextChunk(iterator, 3).then(results => {
      expect(results).toEqual([0,1,2]);
      done();
    });
  });

  it('should return less than max elements if max is not available', (done) => {
    const iterator = counter(2);
    getNextChunk(iterator, 3).then(results => {
      expect(results.length).toEqual(2);
      done();
    });
  });

  it('should return multiple chunks on subsequent calls', (done) => {
    const iterator = counter(8);
    getNextChunk(iterator, 3).then(results => {
      expect(results).toEqual([0, 1, 2]);

      getNextChunk(iterator, 3).then(results => {
        expect(results).toEqual([3, 4, 5]);

        getNextChunk(iterator, 3).then(results => {
          expect(results).toEqual([6, 7]);
          done();
        });
      });
    });
  });
});
