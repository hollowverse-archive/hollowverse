import * as React from 'react';
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
  <div className="error-message">
    {icon}
    <div className="error-message-caption">{caption}</div>
    {description ? (
      <div className="error-message-description">{description}</div>
    ) : null}
    {onActionClick && (
      <button
        type="button"
        className="error-message-button"
        onClick={onActionClick}
      >
        {actionText}
      </button>
    )}
  </div>
);
