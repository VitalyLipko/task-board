import mongoose, { Document } from 'mongoose';

import { Label } from './label.interface';
import { Project } from './project.interface';
import { Task } from './task.interface';
import { User } from './user.interface';

export type ProjectModel = Project & Document;
type TaskModel = Task & Document;
export type UserModel = User & Document;
export type LabelModel = Label & Document;

const { Schema, model } = mongoose;

function idToString(_: unknown, __: unknown, doc: Document) {
  return doc._id.toString();
}

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    parentId: { type: Schema.Types.ObjectId, required: true },
    assignees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isOpen: { type: Boolean, default: true, required: true },
    labels: [{ type: Schema.Types.ObjectId, ref: 'Label' }],
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
  },
);
taskSchema.virtual('id').get(idToString);

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
  },
);
projectSchema.virtual('id').get(idToString);

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
userSchema.virtual('id').get(idToString);
userSchema
  .virtual('fullName')
  .get(function (_: unknown, __: unknown, doc: Document) {
    return `${doc.get('firstName')} ${doc.get('lastName')}`;
  });

const labelSchema = new Schema(
  {
    title: { type: String, required: true },
    backgroundColor: String,
    isSystem: { type: Boolean, default: false },
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
labelSchema.virtual('id').get(idToString);

export const projectModel = model<ProjectModel>('Project', projectSchema);
export const taskModel = model<TaskModel>('Task', taskSchema);
export const userModel = model<UserModel>('User', userSchema);
export const labelModel = model<LabelModel>('Label', labelSchema);
