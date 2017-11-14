import * as React from 'react';
import './styles.scss';

const NavBar = (props: { title: string }) => (
  <div className="navbar">
    <a href="/">{props.title}</a>
  </div>
);

export default NavBar;
