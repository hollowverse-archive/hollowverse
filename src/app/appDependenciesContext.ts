import createReactContext from 'create-react-context';
import { client as defaultApiClient } from 'api/client';
import { createGetUniqueId } from 'helpers/createGetUniqueId';

const defaultLoadAlgoliaModule = async () => import('vendor/algolia');

export const defaultAppDependencies = {
  apiClient: defaultApiClient,
  loadAlgoliaModule: defaultLoadAlgoliaModule,
  getUniqueId: createGetUniqueId(),
};

export type AppDependencies = typeof defaultAppDependencies;

export const AppDependenciesContext = createReactContext(
  defaultAppDependencies,
);
