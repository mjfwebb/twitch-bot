import { describe, expect, test } from 'vitest';

import { parseSevenTVModifierFlags } from './parseSevenTVModifierFlags';

describe('parseSevenTVModifierFlags', async () => {
  test('should return an empty array if no flags are passed', async () => {
    expect(parseSevenTVModifierFlags(0)).toEqual([]);
  });
  test('should return an array of flags', async () => {
    expect(parseSevenTVModifierFlags(256)).toEqual(['zerowidth']);
  });
});
