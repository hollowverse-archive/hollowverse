import { map, tap, ignoreElements } from 'rxjs/operators';

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
import createUserMutation from './CreateUserMutation.graphql';
import viewerQuery from './ViewerQuery.graphql';

export const authEpic: Epic<Action, StoreState, EpicDependencies> = (
  action$,
  state$,
) => {
  const updateViewerOnAuthChange$ = action$
    .ofType<Action<'FACEBOOK_AUTH_RESPONSE_CHANGED'>>(
      'FACEBOOK_AUTH_RESPONSE_CHANGED',
    )
    .pipe(
      map(action => {
        return requestData({
          key: 'viewer',
          requestId: action.payload ? action.payload.accessToken : null,
          keepStaleData: false,
          async load() {
            const apiClient = new GraphQLClient(__API_ENDPOINT__, {
              method: 'POST',
              headers: {
                Authorization: action.payload
                  ? `Bearer ${action.payload.accessToken}`
                  : '',
              },
            });

            const viewerResult = await apiClient
              .request<ViewerQuery>(viewerQuery)
              .catch(r => r.response.data);

            if (
              viewerResult.viewer === null &&
              action.payload &&
              action.payload.accessToken
            ) {
              console.log('User not found, creating...');
              const variables: CreateUserMutationVariables = {
                fbAccessToken: action.payload.accessToken,
              };
              await apiClient.request<CreateUserMutation>(
                createUserMutation,
                variables,
              );
            }

            return apiClient.request<ViewerQuery>(viewerQuery);
          },
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
