import * as React from 'react';
import * as classes from './NavBar.module.scss';

export const NavBar = (props: { title: string }) => (
  <div className={classes.navbar}>
    <a href="/">{props.title}</a>
  </div>
);
