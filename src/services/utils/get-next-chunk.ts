export async function getNextChunk<T>(iterator: AsyncIterator<T>, max: number): Promise<T[]> {
  const chunk = [];
  for (let i = 0; i < max; i++) {
    const next = await iterator.next();
    if (next.done) {
      break;
    }
    chunk.push(next.value);
  }
  return chunk;
}
