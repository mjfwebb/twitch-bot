import type { Command } from '../../models/command-model';
import { generateCommandMessage } from './generateCommandMessage';

describe('generateCommandMessage', () => {
  test('should generate a message for the "test" command', () => {
    const commandData: Command = {
      commandId: 'testComand',
      timesUsed: 10,
    };
    const message = generateCommandMessage(
      'test',
      {
        command: 'test',
        id: 'test',
        description: 'This test description ends in an exclamation mark!',
        callback: () => false,
      },
      commandData,
    );
    expect(message).not.toContain('!.');
  });
});
