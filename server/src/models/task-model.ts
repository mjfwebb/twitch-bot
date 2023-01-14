import type { SchemaTimestampsConfig } from 'mongoose';
import { model, Schema } from 'mongoose';

const TaskSchema = new Schema<Task>(
  {
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export interface Task extends SchemaTimestampsConfig {
  text: string;
}

const TaskModel = model<Task>('Task', TaskSchema);
export default TaskModel;
