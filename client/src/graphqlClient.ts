declare const API_ENDPOINT: string;

import { GraphQLClient } from 'graphql-request';

export const client = new GraphQLClient(API_ENDPOINT);
