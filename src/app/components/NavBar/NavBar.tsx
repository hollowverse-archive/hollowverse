import * as React from 'react';

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
  shouldFocusSearch: boolean;
};

export type DispatchProps = {
  goToSearch(): any;
  searchQueryChanged({ query }: { query: string }): any;
  setShouldFocusSearch(isFocused: boolean): any;
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
      setShouldFocusSearch,
      searchQueryChanged,
      shouldFocusSearch,
      goToSearch,
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
            if (isSearchPage || isSticking || shouldFocusSearch) {
              view = (
                <SearchView
                  shouldFocusSearch={isSearchInProgress}
                  inputValue={searchInputValue}
                  searchQueryChanged={searchQueryChanged}
                  setShouldFocusSearch={setShouldFocusSearch}
                  isSearchPage={isSearchPage}
                  isFocused={isSearchPage}
                  goToSearch={goToSearch}
                />
              );
            } else {
              view = [
                <div key="logo" className={classes.logoWrapper}>
                  <NavBarLink title="Homepage" className={classes.logo} to="/">
                    {title}
                  </NavBarLink>
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
                  className={classes.button}
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
