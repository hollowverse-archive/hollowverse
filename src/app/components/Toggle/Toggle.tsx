import React from 'react';

import classes from './Toggle.module.scss';

export type Props = {
  id: string;
  children: React.ReactNode;
  className?: string;
  defaultChecked?: boolean;
  onChange(): void;
};

export const Toggle = ({
  id,
  className,
  onChange,
  defaultChecked,
  children,
  ...rest
}: Props) => (
  <div className={classes.root}>
    <button
      id={id}
      className={className}
      {...rest}
      aria-checked={defaultChecked}
      onClick={onChange}
      role="switch"
      type="button"
    >
      <label htmlFor={id} className={classes.label}>
        {children}
        <span className="sr-only">: {defaultChecked ? 'On' : 'Off'}</span>
      </label>
      <div aria-hidden className={classes.switch} />
    </button>
  </div>
);
