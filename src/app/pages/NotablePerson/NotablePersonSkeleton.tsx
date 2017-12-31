import * as React from 'react';
import * as classes from './NotablePersonSkeleton.module.scss';
import { times, random } from 'lodash';

export const NotablePersonSkeleton = () => (
  <div className={classes.root} aria-hidden>
    <div className={classes.inner}>
      <div className={classes.gradient} />
      <div className={classes.photo} />
      <div className={classes.caption} />
      <div className={classes.name} />
      <div className={classes.lines}>
        {times(random(2, 4), i => <div key={i} />)}
      </div>
    </div>
  </div>
);
