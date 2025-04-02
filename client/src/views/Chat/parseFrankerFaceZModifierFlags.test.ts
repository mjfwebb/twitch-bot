import { describe, expect, test } from 'vitest';

import { parseFrankerFaceZModifierFlags } from './parseFrankerFaceZModifierFlags';

describe('parseFrankerFaceZModifierFlags', async () => {
  test('should return an empty array if no flags are passed', async () => {
    expect(parseFrankerFaceZModifierFlags(0)).toEqual([]);
  });
  test('should return an array of flags', async () => {
    expect(parseFrankerFaceZModifierFlags(1)).toEqual(['hidden']);
    expect(parseFrankerFaceZModifierFlags(2048)).toEqual(['rainbow']);
    expect(parseFrankerFaceZModifierFlags(12_289)).toEqual(['hypershake', 'hyperred', 'hidden']);
    // FIXME: This is incorrect?
    // expect(parseFrankerFaceZModifierFlags(65_606)).toEqual(['bounce', 'growx', 'flipx', 'flipy', 'hidden']);
  });
});
