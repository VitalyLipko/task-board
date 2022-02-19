import mongoose, { Document, Model } from 'mongoose';

import { File } from './file.interface';
import { Label } from './label.interface';
import { Project } from './project.interface';
import { StatusEnum } from './status.enum';
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

const fileSchema = new Schema<File, Model<File>, File>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  mimeType: { type: String, required: true },
});

const taskSchema = new Schema<Task, Model<Task>, Task>(
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

const projectSchema = new Schema<Project, Model<Project>, Project>(
  {
    name: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    status: { type: String, required: true, default: StatusEnum.Active },
    icon: fileSchema,
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

const userSchema = new Schema<User, Model<User>, User>(
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

const labelSchema = new Schema<Label, Model<Label>, Label>(
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
