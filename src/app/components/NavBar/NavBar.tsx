import * as React from 'react';
import './NavBar.scss';

export const NavBar = (props: { title: string }) => (
  <div className="navbar">
    <a href="/">{props.title}</a>
  </div>
);
