import * as React from 'react';
import * as classes from './SearchResultsSkeleton.module.scss';
import { times } from 'lodash';

export const SearchResultsSkeleton = () => (
  <div className={classes.root} aria-hidden>
    <div className={classes.inner}>
      <div className={classes.gradient} />
      {times(3, i => (
        <div className={classes.result} key={i}>
          <div className={classes.photo} />
          <div className={classes.text} />
        </div>
      ))}
    </div>
  </div>
);
