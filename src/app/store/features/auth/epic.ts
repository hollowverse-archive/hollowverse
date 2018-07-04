import { map, tap, ignoreElements, distinctUntilChanged } from 'rxjs/operators';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { EpicDependencies } from 'store/createConfiguredStore';
import { requestData } from '../asyncData/actions';
import {
  ViewerQuery,
  CreateUserMutation,
  CreateUserMutationVariables,
} from 'api/types';
import { GraphQLClient } from 'graphql-request';
import { merge } from 'rxjs';
import { isUserAuthenticatedToFacebook } from './reducer';

import createUserMutation from './createUserMutation.graphql';
import viewerQuery from './viewerQuery.graphql';

const createLoadViewerAndCreateIfNotExists = (
  fbAccessToken: string | null,
) => async () => {
  const apiClient = new GraphQLClient(__API_ENDPOINT__, {
    method: 'POST',
    headers: {
      Authorization: fbAccessToken ? `Bearer ${fbAccessToken}` : '',
    },
  });

  let viewerResult = await apiClient.request<ViewerQuery>(viewerQuery);

  // If an access token is provider but not matching user is found,
  // that means the user has not signed up to Hollowverse yet.
  // We'll go ahead and create a new account.
  if (viewerResult.viewer === null && fbAccessToken) {
    const variables: CreateUserMutationVariables = {
      fbAccessToken,
    };

    // Create new user
    await apiClient.request<CreateUserMutation>(createUserMutation, variables);

    // Re-query the API to fetch the newly created user
    viewerResult = await apiClient.request<ViewerQuery>(viewerQuery);
  }

  return viewerResult;
};

export const authEpic: Epic<Action, StoreState, EpicDependencies> = (
  action$,
  state$,
) => {
  const updateViewerOnAuthChange$ = state$.pipe(
    map(s => s.authToken),
    distinctUntilChanged(),
    map(accessToken => {
      return requestData({
        key: 'viewer',
        requestId: accessToken,
        keepStaleData: false,
        load: createLoadViewerAndCreateIfNotExists(accessToken),
      });
    }),
  );

  const handleLoginRequest$ = action$.ofType('REQUEST_LOGIN').pipe(
    tap(() => {
      if (!isUserAuthenticatedToFacebook(state$.value)) {
        FB.login();
      }
    }),
    ignoreElements(),
  );

  const handleLogoutRequest$ = action$.ofType('REQUEST_LOGOUT').pipe(
    tap(() => {
      FB.logout();
    }),
    ignoreElements(),
  );

  return merge(
    updateViewerOnAuthChange$,
    handleLoginRequest$,
    handleLogoutRequest$,
  );
};
