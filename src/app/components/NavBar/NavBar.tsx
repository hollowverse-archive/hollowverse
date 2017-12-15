import * as React from 'react';
import cc from 'classcat';

import { withRouter, RouteComponentProps } from 'react-router';

import * as classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';

import searchIcon from 'icons/search.svg';
import backIcon from 'icons/back.svg';

const goBack = () => history;

type Props = {
  title: string;
} & RouteComponentProps<any>;

type State = {
  wasIgnored: boolean;
  isUserInitiated: boolean;
};

export const NavBar = withRouter(
  class extends React.PureComponent<Props, State> {
    state: State = {
      wasIgnored: false,
      isUserInitiated: false,
    };

    searchInput: HTMLInputElement | null = null;

    handleBlur = () => {
      this.setState({ wasIgnored: true, isUserInitiated: false });
    };

    setSearchInput = (node: HTMLInputElement | null) => {
      this.searchInput = node;
    };

    toggleSearch = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      this.setState({ isUserInitiated: true }, () => {
        if (this.searchInput && this.state.isUserInitiated) {
          this.searchInput.focus();
        }
      });
    };

    render() {
      const { title, location } = this.props;
      const { wasIgnored, isUserInitiated } = this.state;
      const isSearchPage = location.pathname === '/search';

      return (
        <Sticky className={classes.root} height={48}>
          {isSticking => {
            const shouldShowSearch =
              isUserInitiated || ((isSearchPage || isSticking) && !wasIgnored);

            return (
              <div className={classes.container}>
                {shouldShowSearch ? (
                  <div className={classes.search}>
                    <form
                      className={classes.searchForm}
                      onBlurCapture={this.handleBlur}
                      action="/search"
                      method="GET"
                    >
                      <input
                        type="search"
                        ref={this.setSearchInput}
                        className={classes.searchInput}
                        required
                        name="query"
                        placeholder="Search for notable people..."
                        autoFocus={isSearchPage}
                      />
                      <button className={classes.button} type="submit">
                        <SvgIcon size={20} {...searchIcon} />
                        <span className="sr-only">Search</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  <a title="Homepage" className={classes.logo} href="/">
                    {title}
                  </a>
                )}
                <a
                  href=".."
                  onClick={shouldShowSearch ? this.toggleSearch : goBack}
                  className={cc([classes.button, classes.back])}
                >
                  <SvgIcon size={20} {...backIcon} />
                  <span className="sr-only">Go Back</span>
                </a>
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
