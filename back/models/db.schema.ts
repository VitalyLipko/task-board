import mongoose from 'mongoose';

import { Task } from './task.interface';

const { Schema } = mongoose;
const taskSchema = new Schema<Task>({
  title: String,
  created: { type: Date, default: Date.now },
});

export const taskModel = mongoose.model<Task>('Task', taskSchema);
