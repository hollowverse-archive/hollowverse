import * as React from 'react';
import { Loggable } from 'components/Loggable/Loggable';
import { Link, LinkProps } from 'react-router-dom';
import { callAll } from 'helpers/callAll';
import { createPath } from 'history';

export type LoggableLinkProps = LinkProps & {
  shouldLogClick?: boolean;
};

export const LoggableLink = ({
  onClick,
  shouldLogClick = true,
  to,
  ...rest
}: LoggableLinkProps) => (
  <Loggable>
    {({ log }) => {
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
    }}
  </Loggable>
);
