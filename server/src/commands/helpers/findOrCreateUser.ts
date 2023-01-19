import type { User } from '../../models/user-model';
import UserModel from '../../models/user-model';
import type { HydratedDocument } from 'mongoose';

export async function findOrCreateUser(userId: string): Promise<HydratedDocument<User>> {
  const user = await UserModel.findOne({ userId });
  if (user) {
    await user.save();
    return user;
  } else {
    const user = new UserModel({
      userId,
    });
    await user.save();
    return user;
  }
}
