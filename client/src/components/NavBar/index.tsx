import * as React from 'react';
import './styles.scss';

const NavBar = (props: { title: string }) => (
  <div className="navbar">{props.title}</div>
);

export default NavBar;
