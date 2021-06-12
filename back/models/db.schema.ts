import mongoose, { Document } from 'mongoose';

import { Project } from './project.interface';
import { Task } from './task.interface';
import { User } from './user.interface';

type ProjectModel = Project & Document;
type TaskModel = Task & Document;
type UserModel = User & Document;

const { Schema, model } = mongoose;

const taskSchema = new Schema<TaskModel>(
  {
    title: { type: String, required: true },
    created: { type: Date, default: Date.now },
    parentId: { type: Schema.Types.ObjectId, required: true },
    assignees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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
taskSchema.virtual('id').get(function (_: any, __: any, doc: Document) {
  return doc._id.toString();
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

const userSchema = new Schema<UserModel>(
  {
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
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
userSchema.virtual('id').get(function (_: any, __: any, doc: Document) {
  return doc._id.toString();
});

export const projectModel = model<ProjectModel>('Project', projectSchema);
export const taskModel = model<TaskModel>('Task', taskSchema);
export const userModel = model<UserModel>('User', userSchema);
