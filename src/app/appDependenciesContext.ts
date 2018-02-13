import createReactContext from 'create-react-context';
import { client as defaultApiClient } from 'api/client';
import { createGetUniqueId } from 'helpers/createGetUniqueId';

const defaultLoadAlgoliaModule = async () => import('vendor/algolia');

export const defaultAppDependenciesContext = {
  apiClient: defaultApiClient,
  loadAlgoliaModule: defaultLoadAlgoliaModule,
  getUniqueId: createGetUniqueId(),
};

export type AppDependencies = typeof defaultAppDependenciesContext;
export const AppDependenciesContext = createReactContext(
  defaultAppDependenciesContext,
);
