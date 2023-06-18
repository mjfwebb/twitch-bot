const FrankerFaceZModifierFlag = {
  hidden: 1,
  flipx: 2,
  flipy: 4,
  growx: 8,
  slide: 16,
  appear: 32,
  rotate: 64,
  rotate90: 128,
  greyscale: 256,
  sepia: 512,
  rainbow: 2048,
  hyperred: 4096,
  shake: 8192,
  cursed: 16384,
  jam: 32768,
  bounce: 65536,
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
