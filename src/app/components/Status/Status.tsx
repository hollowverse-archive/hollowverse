import React from 'react';
import { DispatchOnLifecycleEvent } from 'components/DispatchOnLifecycleEvent/DispatchOnLifecycleEvent';
import { setStatusCode } from 'store/features/status/actions';
import { Action } from 'store/types';

type Props = Action<'SET_STATUS_CODE'>['payload'] & {
  children?: undefined;
};

/**
 * Sets the server's response status code and optionally
 * the redirection URL in case of `301` or `301` codes.
 *
 * This component renders nothing, and should not have `children`.
 *
 * It is only used for its side effect on the Redux store
 * (which is then queried on the server side).
 */
export const Status = ({ children: _, ...rest }: Props) => {
  return <DispatchOnLifecycleEvent onWillMount={setStatusCode(rest)} />;
};
