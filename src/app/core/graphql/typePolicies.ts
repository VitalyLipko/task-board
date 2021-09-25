import { TypedTypePolicies } from './apollo-helpers';

export const typePolicies: TypedTypePolicies = {
  Query: {
    fields: {
      users: {
        merge: false,
      },
    },
  },
};
