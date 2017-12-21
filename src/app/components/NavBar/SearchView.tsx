import * as React from 'react';

import * as classes from './SearchView.module.scss';

import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { NavBarButton } from 'components/NavBar/NavBarButton';

import searchIcon from 'icons/search.svg';
import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';

type Props = {
  inputValue?: string;
  isFocused?: boolean;
  isSearchInProgress: boolean;
  setSearchIsFocused(isFocused: boolean): any;
  requestSearchResults({ query }: { query: string }): any;
};

export class SearchView extends React.PureComponent<Props> {
  searchInput: HTMLInputElement | null = null;

  setSearchInput = (node: HTMLInputElement | null) => {
    this.searchInput = node;
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.requestSearchResults({ query: e.target.value });
  };

  handleSearchInputFocus = () => {
    this.props.setSearchIsFocused(true);
  };

  handleSearchFormBlur = () => {
    this.props.setSearchIsFocused(false);
  };

  render() {
    const { inputValue, isFocused, isSearchInProgress } = this.props;

    return (
      <form
        className={classes.root}
        onBlurCapture={this.handleSearchFormBlur}
        action="/search"
        method="GET"
      >
        <input
          type="search"
          ref={this.setSearchInput}
          className={classes.searchInput}
          onFocus={this.handleSearchInputFocus}
          required
          name="query"
          value={inputValue}
          placeholder="Search for notable people..."
          autoFocus={!inputValue && isFocused}
          onChange={this.handleChange}
        />
        <NavBarButton
          className={classes.button}
          type={isSearchInProgress ? 'button' : 'submit'}
        >
          {isSearchInProgress ? (
            <LoadingSpinner className={classes.button} size={20} />
          ) : (
            <SvgIcon size={20} {...searchIcon} />
          )}
          <span className="sr-only">Search</span>
        </NavBarButton>
      </form>
    );
  }
}
