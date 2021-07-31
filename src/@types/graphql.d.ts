declare module '*.graphql' {
  import { TypedDocumentNode } from '@apollo/client/core';
  const schema: TypedDocumentNode;

  export = schema;
}
