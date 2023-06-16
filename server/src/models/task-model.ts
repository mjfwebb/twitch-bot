import type { SchemaTimestampsConfig } from 'mongoose';
import { model, Schema } from 'mongoose';
import type { ParsedMessageWithCommand } from '../types';

const TaskSchema = new Schema<Task>(
  {
    content: { type: Object, required: true },
  },
  {
    timestamps: true,
  },
);

export interface Task extends SchemaTimestampsConfig {
  content: ParsedMessageWithCommand;
}

const TaskModel = model<Task>('Task', TaskSchema);
export default TaskModel;
