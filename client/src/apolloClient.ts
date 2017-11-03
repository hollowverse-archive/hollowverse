import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

declare const API_ENDPOINT: string;

export const client = new ApolloClient({
  link: new HttpLink({
    uri: API_ENDPOINT,
  }),
  connectToDevTools: true,
  cache: new InMemoryCache(),
});
