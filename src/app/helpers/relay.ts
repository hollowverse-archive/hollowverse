import { FetchMoreOptions } from 'react-apollo';
import { ArrayElement } from 'typings/typeHelpers';

export type Edge<Node> = {
  cursor?: string;
  node: Node;
};

export type NodeFromConnection<T extends Connection> = ArrayElement<
  T['edges']
>['node'];

type PageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
};

export type Connection<Node = any> = {
  edges: Array<Edge<Node>>;
  pageInfo: PageInfo;
};

export function createUpdateRelayConnection<
  ConnectionParent extends { [D in keyof Data]: Connection<Node> },
  Variables = any,
  Node = ArrayElement<
    ConnectionParent[keyof ConnectionParent]['edges']
  >['node'],
  Data extends { [T in keyof ConnectionParent]: Connection<Node> } = {
    [T in keyof ConnectionParent]: Connection<Node>
  }
>(
  key: keyof ConnectionParent,
): FetchMoreOptions<Data, Variables>['updateQuery'] {
  return (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult;
    }

    const { edges: newEdges } = fetchMoreResult[key];
    const { pageInfo } = fetchMoreResult[key];

    return {
      ...(previousResult as any),
      // Put the new edges at the end of the list and update `pageInfo`
      // so we have the new `endCursor` and `hasNextPage` values
      [key]: {
        ...(previousResult[key] as any),
        edges: [...previousResult[key].edges, ...newEdges],
        pageInfo,
      },
    };
  };
}
