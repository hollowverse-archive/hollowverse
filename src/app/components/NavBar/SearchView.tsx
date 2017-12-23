import * as React from 'react';

import * as classes from './SearchView.module.scss';

import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { NavBarButton } from 'components/NavBar/NavBarButton';

import searchIcon from 'icons/search.svg';
import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';

type Props = {
  inputValue?: string;
  isFocused?: boolean;
  shouldFocusSearch: boolean;
  isSearchPage: boolean;
  goToSearch(): any;
  setShouldFocusSearch(isFocused: boolean): any;
  searchQueryChanged({ query }: { query: string }): any;
};

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
    if (props.isFocused && this.searchInput && this.searchInput) {
      this.searchInput.focus();
    }
  };

  handleSearchFormBlur = () => {
    this.props.setShouldFocusSearch(false);
  };

  handleFocus = () => {
    if (!this.props.isSearchPage) {
      this.props.goToSearch();
    }
  };

  render() {
    const { inputValue, shouldFocusSearch } = this.props;

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
          required
          name="query"
          value={inputValue}
          onFocus={this.handleFocus}
          placeholder="Search for notable people..."
          autoFocus={__IS_SERVER__}
          onChange={this.handleChange}
        />
        <NavBarButton
          type={shouldFocusSearch ? 'button' : 'submit'}
        >
          {shouldFocusSearch ? (
            <LoadingSpinner size={20} />
          ) : (
            <SvgIcon size={20} {...searchIcon} />
          )}
          <span className="sr-only">Search</span>
        </NavBarButton>
      </form>
    );
  }
}
