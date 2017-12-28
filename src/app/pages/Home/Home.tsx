import * as React from 'react';

import * as classes from './Home.module.scss';
import { Card } from 'components/Card/Card';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';

import searchIcon from 'icons/search.svg';
import { Link } from 'react-router-dom';

import logo from 'file-loader!assets/favicon.png';
import { goToSearch } from 'store/features/search/actions';
import { connect } from 'react-redux';

export const Home = connect(undefined, { goToSearch })(({ goToSearch }) => (
  <div className={classes.root}>
    <form method="GET" action="/search" className={classes.searchContainer}>
      <Card className={classes.searchBox}>
        <input
          type="search"
          className={classes.input}
          name="query"
          placeholder="Search for notable people"
          onFocus={goToSearch}
        />
        <button type="submit">
          <SvgIcon size={20} className={classes.icon} {...searchIcon} />
          <span className="sr-only">Search</span>
        </button>
      </Card>
    </form>
    <footer className={classes.footer}>
      <ul className={classes.list}>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/privacy">Privacy</Link>
        </li>
        <li>
          <a href="https://twitter.com/hollowverse">Twitter</a>
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
  </div>
));
