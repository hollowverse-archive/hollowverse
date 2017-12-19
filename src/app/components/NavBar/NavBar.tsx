import * as React from 'react';
import cc from 'classcat';

import { RouteComponentProps, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';

import * as classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';

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
    } = this.props;

    return (
      <Switch>
        <Route path="/search">
          <SearchView
            isSearchInProgress={isSearchInProgress}
            inputValue={searchInputValue}
            requestSearchResults={requestSearchResults}
            setSearchIsFocused={setSearchIsFocused}
            isFocused
          />
        </Route>
        <Route>
          <Sticky className={classes.root} height={48}>
            {isSticking => {
              if (isSticking || isSearchFocused) {
                return (
                  <SearchView
                    isSearchInProgress={isSearchInProgress}
                    inputValue={searchInputValue}
                    requestSearchResults={requestSearchResults}
                    setSearchIsFocused={setSearchIsFocused}
                  />
                );
              }

              return (
                <div className={classes.container}>
                  <a title="Homepage" className={classes.logo} href="/">
                    {title}
                  </a>
                  <button
                    disabled={__IS_SERVER__ || location.pathname === '/'}
                    onClick={this.goBack}
                    className={cc([classes.button, classes.back])}
                  >
                    <SvgIcon size={20} {...backIcon} />
                    <span className="sr-only">Go Back</span>
                  </button>
                  <Link to="/search">
                    <SvgIcon size={20} {...searchIcon} />
                    <span className="sr-only">Search</span>
                  </Link>
                </div>
              );
            }}
          </Sticky>
        </Route>
      </Switch>
    );
  }
};
