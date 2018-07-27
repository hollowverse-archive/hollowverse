import React from 'react';

import classes from './Home.module.scss';
import Paper from '@material-ui/core/Paper';

import SearchIcon from '@material-ui/icons/Search';
import { goToSearch } from 'store/features/search/actions';
import { connect } from 'react-redux';
import { Footer } from 'components/Footer/Footer';
import { hot } from 'react-hot-loader';

export const Home = hot(module)(
  connect(
    undefined,
    dispatch => ({
      goToSearch: () => dispatch(goToSearch(undefined)),
    }),
  )(props => (
    <div className={classes.root}>
      <form
        method="GET"
        action="/search"
        role="search"
        className={classes.searchContainer}
      >
        <Paper className={classes.searchBox}>
          <input
            type="search"
            className={classes.input}
            name="query"
            placeholder="Search for notable people"
            onFocus={props.goToSearch}
            required
          />
          <button type="submit">
            <SearchIcon />
            <span className="sr-only">Search</span>
          </button>
        </Paper>
      </form>
      <Footer />
    </div>
  )),
);
