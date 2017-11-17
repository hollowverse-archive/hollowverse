import * as React from 'react';
import styles from './Label.module.scss';

export const Label = (props: { text: string }) => (
  <div className={styles.label}>{props.text}</div>
);
