import createReactContext from 'create-react-context';
import { createGetUniqueId } from 'helpers/createGetUniqueId';
import { GraphQLClient } from 'graphql-request';

const defaultLoadAlgoliaModule = async () => import('vendor/algolia');

export const defaultAppDependencies = {
  loadAlgoliaModule: defaultLoadAlgoliaModule,
  getUniqueId: createGetUniqueId(),
  apiClient: new GraphQLClient(__API_ENDPOINT__, {
    method: 'GET',
  }),
};

export type AppDependencies = typeof defaultAppDependencies;

export const AppDependenciesContext = createReactContext(
  defaultAppDependencies,
);
