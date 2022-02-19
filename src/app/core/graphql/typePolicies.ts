import { TypedTypePolicies } from './apollo-helpers';

export const typePolicies: TypedTypePolicies = {
  Query: {
    fields: {
      users: {
        merge: false,
      },
      projects: {
        merge: false,
      },
    },
  },
  Task: {
    fields: {
      assignees: {
        merge: false,
      },
      labels: {
        merge: false,
      },
    },
  },
};
