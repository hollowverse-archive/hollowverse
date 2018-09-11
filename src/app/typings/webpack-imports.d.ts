/* eslint-disable no-use-before-define */
type SpriteSymbol = {
  id: string;
  viewBox: string;
  content: string;
  url: string;
};

declare module '*.graphql' {
  const query: string;
  export = query;
}

declare module '*.gql' {
  const query: string;
  export = query;
}

declare module '!!graphql-tag/loader!*.graphql' {
  import { DocumentNode } from 'graphql';

  const query: DocumentNode;
  export = query;
}

declare module '!!graphql-tag/loader!*.gql' {
  const query: DocumentNode;
  export = query;
}

declare module '*.svg' {
  const symbol: SpriteSymbol;
  export = symbol;
}

declare module '!!file-loader!*' {
  const url: string;
  export = url;
}

declare module '!!url-loader!*' {
  const url: string;
  export = url;
}

declare module 'file-loader!*' {
  const url: string;
  export = url;
}

declare module '*.html' {
  const str: string;
  export = str;
}
