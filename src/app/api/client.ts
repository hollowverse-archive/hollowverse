import { GraphQLClient } from 'graphql-request';
import { getUniversalUrl } from 'helpers/getUniversalUrl';

export const client = new GraphQLClient(getUniversalUrl(__API_ENDPOINT__), {
  method: 'GET',
});
