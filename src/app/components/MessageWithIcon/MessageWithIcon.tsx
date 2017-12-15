import * as React from 'react';
import cc from 'classcat';

import * as classes from './MessageWithIcon.module.scss';

type Props = {
  caption: string;
  description?: string;
  actionText?: string;
  icon?: React.ReactNode;
  onActionClick?(): void;
};

export const MessageWithIcon = ({
  caption,
  icon,
  description,
  onActionClick,
  actionText,
}: Props) => (
  <div
    className={cc({
      [classes.message]: true,
      [classes.hasDescription]: typeof description === 'string',
    })}
  >
    <div className={classes.messageIcon}>{icon}</div>
    <div className={classes.messageCaption}>{caption}</div>
    {description ? (
      <div className={classes.messageDescription}>{description}</div>
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
