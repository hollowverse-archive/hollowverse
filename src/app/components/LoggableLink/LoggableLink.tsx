import * as React from 'react';
import { Loggable } from 'components/Loggable/Loggable';
import { Link, LinkProps } from 'react-router-dom';
import { compose } from 'helpers/compose';

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
      const logClick = () => log('PAGE_REQUESTED', { url: String(to) });

      return (
        <Link
          to={to}
          onClick={compose(onClick, shouldLogClick ? logClick : undefined)}
          {...rest}
        />
      );
    }}
  </Loggable>
);
