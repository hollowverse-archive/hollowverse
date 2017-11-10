import * as React from 'react';
import cc from 'classcat';

import './styles.scss';

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
      message: true,
      'has-description': typeof description === 'string',
    })}
  >
    {icon}
    <div className="message-caption">{caption}</div>
    {description ? (
      <div className="message-description">{description}</div>
    ) : null}
    {onActionClick && (
      <button type="button" className="message-button" onClick={onActionClick}>
        {actionText}
      </button>
    )}
  </div>
);
