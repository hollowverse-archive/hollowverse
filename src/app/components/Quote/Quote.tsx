import * as React from 'react';

import * as classes from './Quote.module.scss';

type Props = {
  children: string;
  photoUrl: string;
  sourceUrl?: string;
};

export const Quote = ({ children, photoUrl, sourceUrl }: Props) => (
  <div className={classes.quote}>
    <img
      className={classes.quoteAvatar}
      role="presentation"
      alt={undefined}
      src={photoUrl}
    />
    <blockquote cite={sourceUrl}>{children}</blockquote>
  </div>
);
