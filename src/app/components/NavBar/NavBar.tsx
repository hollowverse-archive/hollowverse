import * as React from 'react';
import cc from 'classcat';

import { withRouter, RouteComponentProps } from 'react-router';

import * as classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';

import searchIcon from 'icons/search.svg';
import backIcon from 'icons/back.svg';
import closeIcon from 'icons/back.svg';

type Props = {
  title: string;
  searchQuery: string | null;
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

    render() {
      const { title, location, searchQuery } = this.props;
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
                      value={searchQuery || undefined}
                      placeholder="Search for notable people..."
                      autoFocus={isSearchPage}
                      onChange={this.handleSearchInput}
                    />
                    <button className={classes.button} type="submit">
                      <SvgIcon size={20} {...searchIcon} />
                      <span className="sr-only">Search</span>
                    </button>
                  </form>
                ) : (
                  <a title="Homepage" className={classes.logo} href="/">
                    {title}
                  </a>
                )}
                {isSearchPage || !shouldShowSearch ? (
                  <a href=".." className={cc([classes.button, classes.back])}>
                    <SvgIcon size={20} {...backIcon} />
                    <span className="sr-only">Go Back</span>
                  </a>
                ) : (
                  <button
                    onClick={this.dismissSearch}
                    className={cc([classes.button, classes.back])}
                  >
                    <SvgIcon size={20} {...closeIcon} />
                    <span className="sr-only">Close Search</span>
                  </button>
                )}
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
