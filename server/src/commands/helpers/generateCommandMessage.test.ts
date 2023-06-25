import { describe, expect, test } from 'vitest';

import type { Command } from '../../models/command-model';
import { generateCommandMessage } from './generateCommandMessage';

describe('generateCommandMessage', () => {
  const punctuationMarks = ['..', ':', '?', '!'];

  const commandData: Command = {
    commandId: 'testComand',
    timesUsed: 10,
  };

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
        commandData,
      );
      expect(message).not.toContain(`punctuation mark${punctuationMark}.`);
      expect(message).toContain(`punctuation mark${punctuationMark} `);
    });
  }
});
