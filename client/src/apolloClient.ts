import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

export const client = new ApolloClient({
  link: new HttpLink({
    // tslint:disable-next-line no-http-string
    uri: 'http://localhost:8080/graphql',
  }),
  connectToDevTools: true,
  cache: new InMemoryCache(),
});
