import * as React from 'react';

import * as classes from './Quote.module.scss';

type Props = {
  children: string;
  sourceUrl?: string;
  photoUrl?: string | null;
};

export const Quote = ({ children, photoUrl, sourceUrl }: Props) => (
  <div className={classes.quote}>
    {photoUrl ? (
      <img
        className={classes.quoteAvatar}
        role="presentation"
        alt={undefined}
        src={photoUrl}
      />
    ) : null}
    <blockquote cite={sourceUrl}>{children}</blockquote>
  </div>
);
