import React from 'react';

import classes from './Footer.module.scss';

import { Link } from 'react-router-dom';

import logo from 'file-loader!assets/favicon.png';

export const Footer = () => (
  <footer className={classes.root}>
    <ul className={classes.list}>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/privacy-policy">Privacy</Link>
      </li>
      <li>
        <a href="https://www.facebook.com/The-Hollowverse-206704599442186/">
          Facebook
        </a>
      </li>
    </ul>
    <br />
    <img
      className={classes.logo}
      role="presentation"
      alt={undefined}
      src={logo}
    />
  </footer>
);
