import { Label } from './label.interface';
import { Task } from './task.interface';

export interface Column {
  label: Label;
  items: Array<Task>;
}
export interface Board {
  parentId: string;
  columns: Array<Column>;
}
