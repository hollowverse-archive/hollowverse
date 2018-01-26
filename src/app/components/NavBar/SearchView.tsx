import * as React from 'react';

import * as classes from './SearchView.module.scss';

import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { NavBarButton, NavBarLink } from 'components/NavBar/NavBarButton';

import searchIcon from 'icons/search.svg';
import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { Route, Switch } from 'react-router';

export type DispatchProps = {
  goToSearch(): any;
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

type Props = DispatchProps & StateProps & OwnProps;

export class SearchView extends React.PureComponent<Props> {
  searchInput: HTMLInputElement | null = null;

  setSearchInput = (node: HTMLInputElement | null) => {
    this.searchInput = node;
  };

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
    if (props.isFocused && this.searchInput) {
      if (document.activeElement !== this.searchInput) {
        this.searchInput.focus();
      }
    }
  };

  handleFocus = () => {
    if (!this.props.isSearchPage) {
      this.props.goToSearch();
    }
  };

  handleSearchFormBlur = () => {
    this.props.setShouldFocusSearch(false);
  };

  render() {
    const { inputValue, isSearchInProgress } = this.props;

    return (
      <form
        className={classes.root}
        onBlurCapture={this.handleSearchFormBlur}
        action="/search"
        method="GET"
      >
        <div className={classes.inputWrapper}>
          <input
            type="search"
            ref={this.setSearchInput}
            className={classes.input}
            required
            name="query"
            defaultValue={inputValue}
            placeholder="Search for notable people..."
            onFocus={this.handleFocus}
            autoFocus={__IS_SERVER__ && !inputValue}
            onChange={this.handleChange}
          />
        </div>
        <Switch>
          <Route path="/search">
            <NavBarButton type={isSearchInProgress ? 'button' : 'submit'}>
              {isSearchInProgress ? (
                <LoadingSpinner size={20} />
              ) : (
                <SvgIcon size={20} {...searchIcon} />
              )}
              <span className="sr-only">Search</span>
            </NavBarButton>
          </Route>
          <Route>
            <NavBarLink className={classes.button} to="/search">
              <SvgIcon size={20} {...searchIcon} />
              <span className="sr-only">Search</span>
            </NavBarLink>
          </Route>
        </Switch>
      </form>
    );
  }
}
