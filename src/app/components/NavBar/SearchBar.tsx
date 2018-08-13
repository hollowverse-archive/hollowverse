import React, { createRef } from 'react';

import SearchIcon from '@material-ui/icons/Search';
import { NavBarLink } from 'components/NavBar/NavBarButton';

import { Route, Switch } from 'react-router';
import IconButton from '@material-ui/core/IconButton';
import { Input } from 'components/Input/Input';
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import { navBarSwitch } from './NavBar';

export type DispatchProps = {
  goToSearch(_: void): any;
  setShouldFocusSearch(isFocused: boolean): any;
  searchQueryChanged({ query }: { query: string }): any;
};

export type StateProps = {
  inputValue: string | undefined;
  isFocused: boolean;
  isSearchInProgress: boolean;
  isSearchPage: boolean;
};

export type OwnProps = {};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '@keyframes navbar-switch': navBarSwitch,
    inputWrapper: {
      height: '100%',
      flexGrow: 1,
      padding: theme.spacing.unit,
      animationName: 'navbar-switch',
      animationDuration: `${theme.transitions.duration.shortest}ms`,
      animationFillMode: 'backwards',
    },
  });

type Props = DispatchProps &
  StateProps &
  OwnProps &
  WithStyles<ReturnType<typeof styles>>;

export const SearchBar = withStyles(styles)(
  class extends React.PureComponent<Props> {
    searchInput = createRef<HTMLInputElement>();

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.searchQueryChanged({ query: e.target.value });
    };

    componentWillReceiveProps(nextProps: Props) {
      this.focusIfNecessary(nextProps);
    }

    componentDidMount() {
      this.focusIfNecessary();
    }

    focusIfNecessary = (props: Props = this.props) => {
      if (props.isFocused && this.searchInput.current) {
        if (document.activeElement !== this.searchInput.current) {
          this.searchInput.current.focus();
        }
      }
    };

    goToSearchIfNecessary = () => {
      this.props.goToSearch(undefined);
    };

    handleSearchFormBlur = () => {
      this.props.setShouldFocusSearch(false);
    };

    render() {
      const { classes, inputValue, isSearchPage } = this.props;

      return (
        <form
          className={classes.root}
          onBlurCapture={this.handleSearchFormBlur}
          action="/search"
          method="GET"
          role="search"
        >
          <div className={classes.inputWrapper}>
            <Input
              inputRef={this.searchInput}
              type="search"
              aria-label="Search"
              fullWidth
              inputProps={{
                required: true,
              }}
              name="query"
              value={inputValue}
              placeholder="Search for notable people..."
              onFocus={this.goToSearchIfNecessary}
              autoFocus={isSearchPage}
              onChange={this.handleChange}
            />
          </div>
          <Switch>
            <Route path="/search">
              <>
                <div className="sr-only">Loading...</div>
                <IconButton aria-label="Search" type="submit">
                  <SearchIcon />
                </IconButton>
              </>
            </Route>
            <Route>
              <NavBarLink to="/search">
                <SearchIcon />
                <span className="sr-only">Search</span>
              </NavBarLink>
            </Route>
          </Switch>
        </form>
      );
    }
  },
);
