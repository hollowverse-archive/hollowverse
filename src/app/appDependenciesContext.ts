import createReactContext from 'create-react-context';
import { client as defaultApiClient } from 'api/client';

const defaultLoadAlgoliaModule = async () => import('vendor/algolia');

export const defaultAppDependenciesContext = {
  apiClient: defaultApiClient,
  loadAlgoliaModule: defaultLoadAlgoliaModule,
};

export type AppDependenciesContext = typeof defaultAppDependenciesContext;
export const appDependenciesContext = createReactContext(
  defaultAppDependenciesContext,
);
