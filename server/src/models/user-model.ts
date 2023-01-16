import type { SchemaTimestampsConfig } from 'mongoose';
import { model, Schema } from 'mongoose';

const UserSchema = new Schema<User>(
  {
    userId: { type: String, required: true },
    welcomeMessage: { type: String, required: false },
    points: { type: Number, required: true, default: 0 },
    experience: { type: Number, required: true, default: 0 },
    lastSeen: { type: String, required: true, default: '0' },
  },
  {
    timestamps: true,
  },
);

export interface User extends SchemaTimestampsConfig {
  userId: string;
  welcomeMessage?: string;
  points: number;
  experience: number;
  lastSeen: string;
}

const UserModel = model<User>('User', UserSchema);
export default UserModel;
