import * as React from 'react';
import cc from 'classcat';

import { withRouter, RouteComponentProps } from 'react-router';

import * as classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';

import searchIcon from 'icons/search.svg';
import backIcon from 'icons/back.svg';
import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';

type Props = {
  title: string;
  searchQuery: string | null;
  lastSearchMatch: string | null;
  isSearchInProgress: boolean;
  requestSearchResults({ query }: { query: string }): any;
} & RouteComponentProps<any>;

type State = {
  wasDismissed: boolean;
  isUserInitiated: boolean;
};

export const NavBar = withRouter(
  class extends React.PureComponent<Props, State> {
    state: State = {
      wasDismissed: false,
      isUserInitiated: false,
    };

    searchInput: HTMLInputElement | null = null;

    dismissSearch = () => {
      this.setState({ wasDismissed: true, isUserInitiated: false });
    };

    setSearchInput = (node: HTMLInputElement | null) => {
      this.searchInput = node;
    };

    handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.requestSearchResults({ query: e.target.value });
    };

    toggleSearch = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      this.setState({ isUserInitiated: true }, () => {
        if (this.searchInput && this.state.isUserInitiated) {
          this.searchInput.focus();
        }
      });
    };

    goBack = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      this.props.history.goBack();
    };

    render() {
      const {
        title,
        location,
        searchQuery,
        isSearchInProgress,
        lastSearchMatch,
      } = this.props;
      const { wasDismissed, isUserInitiated } = this.state;
      const isSearchPage = location.pathname === '/search';

      return (
        <Sticky className={classes.root} height={48}>
          {isSticking => {
            const shouldShowSearch =
              isUserInitiated ||
              ((isSearchPage || isSticking) && !wasDismissed);

            return (
              <div className={classes.container}>
                {shouldShowSearch ? (
                  <form
                    className={classes.search}
                    onBlurCapture={
                      !isSearchPage ? this.dismissSearch : undefined
                    }
                    action="/search"
                    method="GET"
                  >
                    <input
                      type="search"
                      ref={this.setSearchInput}
                      className={classes.searchInput}
                      required
                      name="query"
                      value={
                        (isUserInitiated || isSearchPage
                          ? searchQuery
                          : lastSearchMatch) || undefined
                      }
                      placeholder="Search for notable people..."
                      autoFocus={!searchQuery && isSearchPage}
                      onChange={this.handleSearchInput}
                    />
                    {
                      <button
                        disabled={isSearchInProgress}
                        className={classes.button}
                        type="submit"
                      >
                        {!isSearchInProgress ? (
                          <LoadingSpinner size={20} />
                        ) : (
                          <SvgIcon size={20} {...searchIcon} />
                        )}
                        <span className="sr-only">Search</span>
                      </button>
                    }
                  </form>
                ) : (
                  <a title="Homepage" className={classes.logo} href="/">
                    {title}
                  </a>
                )}
                <button
                  disabled={__IS_SERVER__ || location.pathname === '/'}
                  onClick={this.goBack}
                  className={cc([classes.button, classes.back])}
                >
                  <SvgIcon size={20} {...backIcon} />
                  <span className="sr-only">Go Back</span>
                </button>
                {!shouldShowSearch ? (
                  <a
                    href="/search"
                    onClick={this.toggleSearch}
                    className={classes.button}
                  >
                    <SvgIcon size={20} {...searchIcon} />
                    <span className="sr-only">Search</span>
                  </a>
                ) : null}
              </div>
            );
          }}
        </Sticky>
      );
    }
  },
);
