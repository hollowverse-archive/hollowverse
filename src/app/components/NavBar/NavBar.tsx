import * as React from 'react';
import cc from 'classcat';

import { RouteComponentProps } from 'react-router';

import * as classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { NavBarButton, NavBarLink } from 'components/NavBar/NavBarButton';

import searchIcon from 'icons/search.svg';
import backIcon from 'icons/back.svg';
import { SearchView } from 'components/NavBar/SearchView';

export type OwnProps = {
  title: string;
};

export type StateProps = {
  searchInputValue?: string;
  isSearchInProgress: boolean;
  isSearchFocused: boolean;
};

export type DispatchProps = {
  requestSearchResults({ query }: { query: string }): any;
  setSearchIsFocused(isFocused: boolean): any;
};

type Props = OwnProps & StateProps & DispatchProps;

export const NavBar = class extends React.Component<
  Props & RouteComponentProps<any>
> {
  goBack = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    this.props.history.goBack();
  };

  render() {
    const {
      title,
      searchInputValue,
      isSearchInProgress,
      setSearchIsFocused,
      requestSearchResults,
      isSearchFocused,
      location,
    } = this.props;

    const isSearchPage = location.pathname === '/search';

    return (
      <div className={classes.root}>
        <Sticky
          className={classes.sticky}
          innerClassName={classes.viewWrapper}
          height={48}
        >
          {isSticking => {
            let view;
            if (isSearchPage || isSticking || isSearchFocused) {
              view = (
                <SearchView
                  isSearchInProgress={isSearchInProgress}
                  inputValue={searchInputValue}
                  requestSearchResults={requestSearchResults}
                  setSearchIsFocused={setSearchIsFocused}
                  isFocused={isSearchPage}
                />
              );
            } else {
              view = [
                <div key="logo" className={classes.logoWrapper}>
                  <a title="Homepage" className={classes.logo} href="/">
                    {title}
                  </a>
                </div>,
                <NavBarLink className={classes.button} key="link" to="/search">
                  <SvgIcon size={20} {...searchIcon} />
                  <span className="sr-only">Search</span>
                </NavBarLink>,
              ];
            }

            return (
              <div className={classes.view}>
                <NavBarButton
                  disabled={__IS_SERVER__ || location.pathname === '/'}
                  onClick={this.goBack}
                  className={cc([classes.button, classes.backButton])}
                >
                  <SvgIcon size={20} {...backIcon} />
                  <span className="sr-only">Go Back</span>
                </NavBarButton>
                {view}
              </div>
            );
          }}
        </Sticky>
      </div>
    );
  }
};
