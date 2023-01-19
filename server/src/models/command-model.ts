import type { SchemaTimestampsConfig } from 'mongoose';
import { model, Schema } from 'mongoose';

const CommandSchema = new Schema<Command>({
  commandId: { type: String, required: true },
  timesUsed: { type: Number, required: true, default: 0 },
});

export interface Command extends SchemaTimestampsConfig {
  commandId: string;
  timesUsed: number;
}

const CommandModel = model<Command>('Command', CommandSchema);
export default CommandModel;
