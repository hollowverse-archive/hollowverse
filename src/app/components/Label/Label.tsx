import * as React from 'react';
import * as classes from './Label.module.scss';

export const Label = (props: { text: string }) => (
  <div className={classes.label}>{props.text}</div>
);
