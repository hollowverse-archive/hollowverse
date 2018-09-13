import React from 'react';
import IntersectionObserver from 'react-intersection-observer';
import { QueryResult } from 'react-apollo';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import {
  createUpdateRelayConnection,
  Connection,
  Edge,
  NodeFromConnection,
} from 'helpers/relay';
import { ArrayElement } from 'typings/typeHelpers';
import isEmpty from 'lodash/isEmpty';

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

    const onIntersectionChange = async (inView: boolean) => {
      console.log('Intersection change');

      if (!inView) {
        return;
      }

      console.log('Loading more...');

      await fetchMore({
        variables: {
          after: endCursor,
        },
        updateQuery,
      });

      console.log('Loaded more');
    };

    return (
      <>
        {edges.map(edge => renderEdge({ edge, variables }))}
        {loading ? placeholder : null}
        {hasNextPage && !loading ? (
          <IntersectionObserver onChange={onIntersectionChange}>
            {inView => (inView ? placeholder : null)}
          </IntersectionObserver>
        ) : null}
      </>
    );
  }
}
