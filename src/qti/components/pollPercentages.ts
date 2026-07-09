function createSeededRng(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }

  return () => {
    hash = (hash * 1103515245 + 12345) | 0;
    return ((hash >>> 0) % 10_000) / 10_000;
  };
}

/** Almost-equal poll bars that still sum to 100 (e.g. 32/32/36 or 26/22/24/28). */
export function distributePollPercentages(count: number, seed: string): number[] {
  if (count <= 0) return [];
  if (count === 1) return [100];

  const rng = createSeededRng(seed);
  const average = 100 / count;
  const spread = Math.max(3, Math.floor(16 / count));

  const raw = Array.from(
    { length: count },
    () => average + (rng() * 2 - 1) * spread
  );
  const total = raw.reduce((sum, value) => sum + value, 0);
  const rounded = raw.map((value) => Math.round((value * 100) / total));

  let remainder = 100 - rounded.reduce((sum, value) => sum + value, 0);
  let index = 0;

  while (remainder !== 0) {
    const target = index % count;
    if (remainder > 0) {
      rounded[target]++;
      remainder--;
    } else if (rounded[target] > 1) {
      rounded[target]--;
      remainder++;
    }
    index++;
  }

  return rounded;
}
