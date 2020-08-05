export function getNextChunk<T>(iterator: Iterator<T>, max: number): Promise<T[]> {
  const chunk = [];
  for (let i = 0; i < max; i++) {
    const item = iterator.next().value;
    chunk.push(item);
  }
  return Promise.resolve(chunk);
}
