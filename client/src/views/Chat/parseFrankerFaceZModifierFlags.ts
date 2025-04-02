const FrankerFaceZModifierFlag = {
  hidden: 1,
  flipx: 2,
  flipy: 4,
  growx: 8,
  slide: 16,
  appear: 32,
  leave: 64,
  rotate: 128,
  rotate90: 256,
  greyscale: 512,
  sepia: 1024,
  rainbow: 2048,
  hyperred: 4096,
  hypershake: 8192,
  cursed: 16384,
  jam: 32768,
  bounce: 65536,
  nospace: 131072,
};

export function parseFrankerFaceZModifierFlags(flags: number): string[] {
  const parsedFlags: string[] = [];
  let remainingFlags = flags;
  if (flags === 0) {
    return [];
  }
  for (const [key, value] of Object.entries(FrankerFaceZModifierFlag).reverse()) {
    if (remainingFlags >= value) {
      remainingFlags = remainingFlags - value;
      parsedFlags.push(key);
    }
  }
  return parsedFlags;
}
