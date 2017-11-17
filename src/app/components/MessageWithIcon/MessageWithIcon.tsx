import * as React from 'react';
import cc from 'classcat';

import styles from './MessageWithIcon.module.scss';

type Props = {
  caption: string;
  description?: string;
  actionText?: string;
  icon?: JSX.Element;
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
      [styles.message]: true,
      [styles['has-description']]: typeof description === 'string',
    })}
  >
    <div className={styles['message-icon']}>{icon}</div>
    <div className={styles['message-caption']}>{caption}</div>
    {description ? (
      <div className={styles['message-description']}>{description}</div>
    ) : null}
    {onActionClick && (
      <button
        type="button"
        className={styles['message-button']}
        onClick={onActionClick}
      >
        {actionText}
      </button>
    )}
  </div>
);
