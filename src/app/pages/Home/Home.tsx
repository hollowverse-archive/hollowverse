import React from 'react';

import classes from './Home.module.scss';
import { Card } from 'components/Card/Card';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';

import searchIcon from 'icons/search.svg';
import { goToSearch } from 'store/features/search/actions';
import { connect } from 'react-redux';
import { Footer } from 'components/Footer/Footer';
import { hot } from 'react-hot-loader';
export const Home = hot(module)(
  connect(undefined, dispatch => ({
    goToSearch: () => dispatch(goToSearch(undefined)),
  }))(props => (
    <div className={classes.root}>
      <form method="GET" action="/search" className={classes.searchContainer}>
        <Card className={classes.searchBox}>
          <input
            type="search"
            className={classes.input}
            name="query"
            placeholder="Search for notable people"
            onFocus={props.goToSearch}
            required
          />
          <button type="submit">
            <SvgIcon size={20} className={classes.icon} {...searchIcon} />
            <span className="sr-only">Search</span>
          </button>
        </Card>
      </form>
      <Footer />
    </div>
  )),
);
