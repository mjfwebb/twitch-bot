import type { SchemaTimestampsConfig } from 'mongoose';
import { model, Schema } from 'mongoose';

const UserSchema = new Schema<User>(
  {
    userId: { type: String, required: true, unique: true },
    nick: { type: String, required: false },
    displayName: { type: String, required: false },
    welcomeMessage: { type: String, required: false },
    points: { type: Number, required: true, default: 0 },
    experience: { type: Number, required: true, default: 0 },
    lastSeen: { type: String, required: true, default: '0' },
    avatarUrl: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

export interface User extends SchemaTimestampsConfig {
  userId: string;
  nick: string;
  displayName: string;
  welcomeMessage?: string;
  points: number;
  experience: number;
  lastSeen: string;
  avatarUrl: string;
}

const UserModel = model<User>('User', UserSchema);
export default UserModel;
