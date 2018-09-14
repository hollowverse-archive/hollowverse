import React from 'react';
import IntersectionObserver from 'react-intersection-observer';
import { QueryResult, FetchMoreOptions } from 'react-apollo';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import {
  createUpdateRelayConnection,
  Connection,
  Edge,
  NodeFromConnection,
} from 'helpers/relay';
import { ArrayElement } from 'typings/typeHelpers';
import isEmpty from 'lodash/isEmpty';

type CreateOnIntersectionChangeOptions<Data, Variables> = {
  updateQuery: FetchMoreOptions<Data, Variables>['updateQuery'];
  fetchMore: QueryResult<Data, Variables>['fetchMore'];
  endCursor?: string | null;
};

function createOnIntersectionChange<
  Data,
  Variables extends { after?: string | null }
>({
  updateQuery,
  endCursor,
  fetchMore,
}: CreateOnIntersectionChangeOptions<Data, Variables>) {
  return async (inView: boolean) => {
    if (!inView) {
      return;
    }

    await fetchMore({
      variables: {
        after: endCursor,
      },
      updateQuery,
    });
  };
}

export type RenderEdgeProps<
  Data extends Record<Key, Connection>,
  Key extends keyof Data,
  Variables
> = {
  edge: Edge<NodeFromConnection<Data[Key]>>;
  variables: Variables;
};

type Props<
  ConnectionParent extends { [D in keyof Data]: Connection<Node> },
  Variables = any,
  Node = ArrayElement<
    ConnectionParent[keyof ConnectionParent]['edges']
  >['node'],
  Data extends { [T in keyof ConnectionParent]: Connection<Node> } = {
    [T in keyof ConnectionParent]: Connection<Node>
  }
> = QueryResult<Data, Variables> & {
  connectionKey: keyof ConnectionParent;
  placeholder: React.ReactNode;
  renderEdge(
    props: RenderEdgeProps<Data, keyof ConnectionParent, Variables>,
  ): React.ReactNode;
};

export class InfiniteConnection<
  ConnectionParent extends { [D in keyof Data]: Connection<Node> },
  Variables extends { after?: string | null },
  Node = ArrayElement<
    ConnectionParent[keyof ConnectionParent]['edges']
  >['node'],
  Data extends { [T in keyof ConnectionParent]: Connection<Node> } = {
    [T in keyof ConnectionParent]: Connection<Node>
  }
> extends React.PureComponent<Props<ConnectionParent, Variables, Node, Data>> {
  render() {
    const {
      data,
      loading,
      error,
      connectionKey,
      fetchMore,
      variables,
      placeholder,
      renderEdge,
    } = this.props;

    if (error) {
      return <MessageWithIcon title="Failed to load" />;
    }

    if (loading && isEmpty(data)) {
      return placeholder;
    }

    if (!data || isEmpty(data) || isEmpty(data[connectionKey].edges)) {
      return <MessageWithIcon title="Nothing to show here" />;
    }

    const updateQuery = createUpdateRelayConnection<Data>(connectionKey);

    const {
      edges,
      pageInfo: { endCursor, hasNextPage },
    } = data[connectionKey];

    return (
      <>
        {edges.map(edge => renderEdge({ edge, variables }))}
        {loading ? placeholder : null}
        {hasNextPage && !loading ? (
          <IntersectionObserver
            onChange={createOnIntersectionChange({
              updateQuery,
              fetchMore,
              endCursor,
            })}
          >
            {inView => (inView ? placeholder : null)}
          </IntersectionObserver>
        ) : null}
      </>
    );
  }
}
