import * as React from 'react';

import * as classes from './Quote.module.scss';

type Props = {
  children: string;
  photoUrl: string;
  size?: 'small' | 'normal';
};

export const Quote = ({ children, photoUrl }: Props) => (
  <div className={classes.quote}>
    <img
      className={classes.quoteAvatar}
      role="presentation"
      alt={undefined}
      src={photoUrl}
    />
    {children}
  </div>
);
