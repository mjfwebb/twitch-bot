import type { SchemaTimestampsConfig } from 'mongoose';
import { model, Schema } from 'mongoose';

const StreamSchema = new Schema<Stream>(
  {
    startedAt: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export interface Stream extends SchemaTimestampsConfig {
  startedAt: string;
}

const StreamModel = model<Stream>('Stream', StreamSchema);
export default StreamModel;
