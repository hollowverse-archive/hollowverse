import * as React from 'react';
import { DispatchOnLifecycleEvent } from 'components/DispatchOnLifecycleEvent/DispatchOnLifecycleEvent';
import {
  setStatusCode,
  setRedirectionUrl,
} from 'store/features/status/actions';
import { Action } from 'store/types';

type CommonProps = {
  updateKey?: string;
  children?: undefined;
};

type RedirectionProps = {
  code: 301 | 302;
  redirectTo: string;
};

type NonRedirectionProps = {
  code: 200 | 404 | 500;
};

type Props = CommonProps & (RedirectionProps | NonRedirectionProps);

function isRedirection(props: Props): props is CommonProps & RedirectionProps {
  return (
    props.code === 301 ||
    (props.code === 302 &&
      typeof (props as RedirectionProps).redirectTo === 'string')
  );
}

/**
 * Sets the server's response status code and optionally
 * the redirection URL in case of `301` or `301` codes.
 *
 * This component renders nothing, and should not have `children`.
 *
 * It is only used for its side effect on the Redux store
 * (which is then queried on the server side).
 */
export const Status = (props: Props) => {
  const actions: Action[] = [setStatusCode(props.code)];

  if (isRedirection(props)) {
    actions.push(setRedirectionUrl(props.redirectTo));
  }

  return (
    <DispatchOnLifecycleEvent
      updateKey={props.updateKey}
      onWillMountOrUpdate={actions}
    />
  );
};
