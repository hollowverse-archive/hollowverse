import { GraphQLClient } from 'graphql-request';

export const client = new GraphQLClient(__API_ENDPOINT__, {
  method: 'GET',
});
