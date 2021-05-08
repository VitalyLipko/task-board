import mongoose, { Document } from 'mongoose';

import { Task } from './task.interface';
import { User } from './user.interface';

type UserModel = User & Document;

const { Schema } = mongoose;
const taskSchema = new Schema<Task>({
  title: String,
  created: { type: Date, default: Date.now },
});
const userSchema = new Schema<UserModel>({
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String,
});

export const taskModel = mongoose.model<Task>('Task', taskSchema);
export const userModel = mongoose.model<UserModel>('User', userSchema);
