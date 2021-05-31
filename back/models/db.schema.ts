import mongoose, { Document, Model } from 'mongoose';

import { Project } from './project.interface';
import { Task } from './task.interface';
import { User } from './user.interface';

type ProjectModel = Project & Document;
type UserModel = User & Document;

const { Schema, model } = mongoose;

const taskSchema = new Schema<Task>({
  title: String,
  created: { type: Date, default: Date.now },
  parentId: Schema.Types.ObjectId,
});
const projectSchema = new Schema<ProjectModel>(
  {
    name: { type: String, required: true },
    created: { type: Date, default: Date.now },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);
projectSchema.virtual('id').get(function (_: any, __: any, doc: Document) {
  return doc._id.toString();
});

const userSchema = new Schema<UserModel>({
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String,
});

export const projectModel = model<ProjectModel>('Project', projectSchema);
export const taskModel = model<Task>('Task', taskSchema);
export const userModel = model<UserModel>('User', userSchema);
