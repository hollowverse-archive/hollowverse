import React from 'react';

import Paper from '@material-ui/core/Paper';

import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import { goToSearch } from 'store/features/search/actions';
import { connect } from 'react-redux';
import { Footer } from 'components/Footer/Footer';
import { hot } from 'react-hot-loader';

import {
  createStyles,
  withStyles,
  Theme,
  WithStyles,
} from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: theme.breakpoints.values.sm,
      flexGrow: 1,
      alignSelf: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '90%',
    },
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      padding: `0 ${theme.spacing.unit}px`,
    },
    input: {
      flexGrow: 1,
      background: 'transparent',
    },
  });

type Props = WithStyles<ReturnType<typeof styles>> & {
  goToSearch(): any;
};

const UnstyledHome = connect(
  undefined,
  dispatch => ({
    goToSearch: () => dispatch(goToSearch(undefined)),
  }),
)(({ classes, ...rest }: Props) => (
  <div className={classes.root}>
    <form
      method="GET"
      action="/search"
      role="search"
      className={classes.searchContainer}
    >
      <Paper className={classes.searchBox}>
        <Input
          disableUnderline
          type="search"
          className={classes.input}
          name="query"
          placeholder="Search for notable people"
          onFocus={rest.goToSearch}
          required
        />
        <IconButton type="submit">
          <SearchIcon />
          <span className="sr-only">Search</span>
        </IconButton>
      </Paper>
    </form>
    <Footer />
  </div>
));

export const Home = hot(module)(withStyles(styles)(UnstyledHome));
