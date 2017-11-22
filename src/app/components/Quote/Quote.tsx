import * as React from 'react';

import * as classes from './Quote.module.scss';

type Props = {
  children: string;
  quoteBy: string;
  photoUrl: string;
  size?: 'small' | 'normal';
};

export const Quote = ({ children, photoUrl, quoteBy }: Props) => (
  <div className={classes.quote}>
    <img className={classes.quoteAvatar} src={photoUrl} alt={quoteBy} />
    {children}
  </div>
);
