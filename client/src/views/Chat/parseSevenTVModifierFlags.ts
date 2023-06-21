const SevenTVModifierFlag = {
  zerowidth: 256,
};

export function parseSevenTVModifierFlags(flags: number): string[] {
  const parsedFlags: string[] = [];
  let remainingFlags = flags;
  if (flags === 0) {
    return [];
  }
  for (const [key, value] of Object.entries(SevenTVModifierFlag).reverse()) {
    if (remainingFlags >= value) {
      remainingFlags = remainingFlags - value;
      parsedFlags.push(key);
    }
  }
  return parsedFlags;
}
