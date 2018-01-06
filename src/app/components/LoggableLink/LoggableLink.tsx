import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { callAll } from 'helpers/callAll';
import { createPath } from 'history';
import { connect } from 'react-redux';
import { log as logAction } from 'store/features/logging/actions';

export type LoggableLinkProps = LinkProps & {
  shouldLogClick?: boolean;
  log: typeof logAction;
};

export const LoggableLink = connect(undefined, { log: logAction })(
  ({ onClick, shouldLogClick = true, to, log, ...rest }: LoggableLinkProps) => {
    const logClick = () =>
      log('PAGE_REQUESTED', {
        url: typeof to === 'string' ? to : createPath(to),
      });

    return (
      <Link
        to={to}
        onClick={callAll(onClick, shouldLogClick ? logClick : undefined)}
        {...rest}
      />
    );
  },
);
