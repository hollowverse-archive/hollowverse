import * as React from 'react';
import * as classes from './NotablePersonSkeleton.module.scss';

export const NotablePersonSkeleton = () => (
  <div className={classes.root}>
    <div className={classes.inner}>
      <div className={classes.gradient} />
      <div className={classes.avatar} />
      <div className={classes.caption} />
      <div className={classes.name} />
      <div className={classes.paragraph} />
      <div className={classes.paragraph} />
      <div className={classes.paragraph} />
    </div>
  </div>
);
