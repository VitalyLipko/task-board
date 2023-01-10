import {
  CreateUserInput,
  UpdateUserInput,
} from '../../../core/graphql/graphql';

export type UserModalFormType =
  | (CreateUserInput & { confirmPassword?: string })
  | UpdateUserInput;
