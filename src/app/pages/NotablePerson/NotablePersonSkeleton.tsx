import * as React from 'react';
import cc from 'classcat';
import * as classes from './NotablePersonSkeleton.module.scss';

export const NotablePersonSkeleton = () => (
  <div className={classes.personLoading}>
    <div className={classes.personLoadingInner}>
      <div className={classes.personLoadingGradient} />
      <div className={classes.personLoadingAvatar} />
      <div className={classes.personLoadingCaption} />
      <div className={classes.personLoadingName} />
      <div className={classes.personLoadingParagraph} />
      <div className={cc([classes.personLoadingParagraph, classes.second])} />
      <div className={cc([classes.personLoadingParagraph, classes.third])} />
    </div>
  </div>
);
