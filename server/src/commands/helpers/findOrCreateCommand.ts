import type { HydratedDocument } from 'mongoose';
import type { Command } from '../../models/command-model';
import CommandModel from '../../models/command-model';

export async function findOrCreateCommand(commandId: string): Promise<HydratedDocument<Command>> {
  const command = await CommandModel.findOne({ commandId });
  if (command) {
    await command.save();
    return command;
  } else {
    const command = new CommandModel({
      commandId,
    });
    await command.save();
    return command;
  }
}
