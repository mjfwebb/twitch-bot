import type { SchemaTimestampsConfig } from 'mongoose';
import { model, Schema } from 'mongoose';

const CommandSchema = new Schema<Command>({
  command: { type: [String], required: false },
  commandId: { type: String, required: true },
  cooldown: { type: Number, required: false },
  description: { type: String, required: false },
  message: { type: String, required: false },
  timesUsed: { type: Number, required: true, default: 0 },
});

export interface Command extends SchemaTimestampsConfig {
  command?: string | string[];
  commandId: string;
  cooldown?: number;
  description?: string;
  message?: string;
  timesUsed: number;
}

const CommandModel = model<Command>('Command', CommandSchema);
export default CommandModel;
