import { describe, expect, test } from 'vitest';

import { generateCommandMessage } from './generateCommandMessage';

describe('generateCommandMessage', () => {
  const punctuationMarks = ['..', ':', '?', '!'];

  for (const punctuationMark of punctuationMarks) {
    test(`should make sure is a single punctuation mark when using ${punctuationMark}`, () => {
      const message = generateCommandMessage(
        'test',
        {
          command: 'test',
          id: 'test',
          description: `This test description ends in an punctuation mark${punctuationMark}`,
          callback: () => false,
        },
        10,
      );
      expect(message).not.toContain(`punctuation mark${punctuationMark}.`);
      expect(message).toContain(`punctuation mark${punctuationMark} `);
    });
  }
});
