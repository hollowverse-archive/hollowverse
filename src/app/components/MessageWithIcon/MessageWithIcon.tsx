import * as React from 'react';
import cc from 'classcat';

import * as classes from './MessageWithIcon.module.scss';

type Props = {
  caption: string;
  description?: string;
  actionText?: string;
  icon?: React.ReactNode;
  onActionClick?(): void;
} & React.HTMLAttributes<HTMLDivElement>;

export const MessageWithIcon = ({
  caption,
  icon,
  description,
  onActionClick,
  actionText,
  children,
  className,
  ...rest,
}: Props) => (
  <div
    className={cc([
      className,
      {
        [classes.message]: true,
        [classes.hasDescription]: typeof description === 'string',
      },
    ])}
    {...rest}
  >
    <div className={classes.messageIcon}>{icon}</div>
    <div className={classes.messageCaption}>{caption}</div>
    {description ? (
      <div className={classes.messageDescription}>
        {description}
        {children}
      </div>
    ) : null}
    {onActionClick && (
      <button
        type="button"
        className={classes.messageButton}
        onClick={onActionClick}
      >
        {actionText}
      </button>
    )}
  </div>
);
