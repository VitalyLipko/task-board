import { CodegenConfig } from '@graphql-codegen/cli';

import envConfig from './back/config';

const config: CodegenConfig = {
  schema: `http://localhost:${envConfig.port}/graphql`,
  generates: {
    'src/app/core/graphql/graphql.ts': { plugins: ['typescript'] },
    'src/app/core/graphql/schema.json': {
      plugins: ['introspection'],
      config: { minify: true },
    },
    'src/app/core/graphql/apollo-helpers.ts': {
      plugins: ['typescript-apollo-client-helpers'],
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write', 'eslint --fix'] },
};

export default config;
