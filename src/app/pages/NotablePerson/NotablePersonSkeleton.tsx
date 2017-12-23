import * as React from 'react';
import * as classes from './NotablePersonSkeleton.module.scss';

export const NotablePersonSkeleton = () => (
  <div className={classes.root} aria-hidden>
    <div className={classes.inner}>
      <div className={classes.gradient} />
      <div className={classes.photo} />
      <div className={classes.caption} />
      <div className={classes.name} />
      <div className={classes.lines}>
        <div />
        <div />
        <div />
      </div>
    </div>
  </div>
);