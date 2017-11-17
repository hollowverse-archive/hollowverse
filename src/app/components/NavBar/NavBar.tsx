import * as React from 'react';
import styles from './NavBar.module.scss';

export const NavBar = (props: { title: string }) => (
  <div className={styles.navbar}>
    <a href="/">{props.title}</a>
  </div>
);
