import mongoose, { Document } from 'mongoose';

import { Project } from './project.interface';
import { Task } from './task.interface';
import { User } from './user.interface';

export type ProjectModel = Project & Document;
type TaskModel = Task & Document;
export type UserModel = User & Document;

const { Schema, model } = mongoose;

const taskSchema = new Schema(
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
taskSchema.virtual('id').get(function (_: unknown, __: unknown, doc: Document) {
  return doc._id.toString();
});

const projectSchema = new Schema(
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
projectSchema
  .virtual('id')
  .get(function (_: unknown, __: unknown, doc: Document) {
    return doc._id.toString();
  });

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    trashed: { type: Boolean, default: false },
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
userSchema.virtual('id').get(function (_: unknown, __: unknown, doc: Document) {
  return doc._id.toString();
});
userSchema
  .virtual('fullName')
  .get(function (_: unknown, __: unknown, doc: Document) {
    return `${doc.get('firstName')} ${doc.get('lastName')}`;
  });

export const projectModel = model<ProjectModel>('Project', projectSchema);
export const taskModel = model<TaskModel>('Task', taskSchema);
export const userModel = model<UserModel>('User', userSchema);
