import * as React from 'react';
import gql from 'graphql-tag';
import { client } from 'api/client';

import * as classes from './Home.module.scss';

import { WithData } from 'hocs/WithData/WithData';
import { NotablePeopleQuery } from 'api/types';
import {
  AsyncResult,
  isPendingResult,
  isErrorResult,
} from 'helpers/asyncResults';
import { Square } from 'components/Square/Square';
import { Link } from 'react-router-dom';

const query = gql`
  query NotablePeople($first: Int!, $after: ID) {
    notablePeople(first: $first, after: $after) {
      edges {
        node {
          name
          slug
          photoUrl
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const load = () => {
  return client.request<NotablePeopleQuery>(query, { first: 10 });
};

export const Home = () => (
  <div className={classes.root}>
    <WithData dataKey="homePageQuery" requestId="homepage" load={load}>
      {({ result }: { result: AsyncResult<NotablePeopleQuery | null> }) => {
        if (isPendingResult(result)) {
          return <div>Loading...</div>;
        } else if (isErrorResult(result)) {
          return <div>Error</div>;
        }

        if (result.value) {
          const { notablePeople } = result.value;

          return (
            <ul className={classes.peopleList}>
              {notablePeople.edges.map(({ node: person }) => {
                return (
                  <li key={person.slug} className={classes.person}>
                    <Link to={`/${person.slug}`}>
                      {person.photoUrl ? (
                        <Square>
                          <img alt={person.name} src={person.photoUrl} />
                        </Square>
                      ) : null}
                      <div className={classes.name}>{person.name}</div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          );
        }

        return null;
      }}
    </WithData>
  </div>
);
