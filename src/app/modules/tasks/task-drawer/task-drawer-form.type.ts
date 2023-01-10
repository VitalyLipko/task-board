import {
  CreateTaskInput,
  UpdateTaskInput,
} from '../../../core/graphql/graphql';

export type TaskDrawerFormType = Partial<CreateTaskInput | UpdateTaskInput>;
