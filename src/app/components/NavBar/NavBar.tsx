import * as React from 'react';
import cc from 'classcat';

import * as classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';

import searchIcon from 'icons/search.svg';
import backIcon from 'icons/back.svg';

type Props = {
  title: string;
};

type State = {
  wasIgnored: boolean;
  isUserInitiated: boolean;
};

export class NavBar extends React.PureComponent<Props, State> {
  state: State = {
    wasIgnored: false,
    isUserInitiated: false,
  };

  searchInput: HTMLInputElement | null = null;

  handleBlur = () => {
    this.setState({ wasIgnored: true, isUserInitiated: false });
  };

  toggleUserInitiated = () => {
    this.setState(state => ({ isUserInitiated: !state.isUserInitiated }));
  };

  setSearchInput = (node: HTMLInputElement | null) => {
    this.searchInput = node;
  };

  componentDidUpdate() {
    if (this.searchInput && this.state.isUserInitiated) {
      this.searchInput.focus();
    }
  }

  render() {
    const { title } = this.props;
    const { wasIgnored, isUserInitiated } = this.state;

    return (
      <Sticky className={classes.navbar} height={48}>
        {isSticking =>
          (isSticking && !wasIgnored) || isUserInitiated ? (
            <div key="search" className={classes.search}>
              <form className={classes.searchForm}>
                <input
                  type="search"
                  ref={this.setSearchInput}
                  className={classes.searchInput}
                  required
                  placeholder="Search for notable people..."
                  onBlur={this.handleBlur}
                />
              </form>
            </div>
          ) : (
            <div className={classes.logo}>
              <a title="Homepage" className={classes.title} href="/">
                {title}
              </a>
              <a className={cc([classes.button, classes.back])} href="..">
                <SvgIcon size={20} {...backIcon} />
                <span className="sr-only">Go Back</span>
              </a>
              <label className={classes.button}>
                <input
                  onChange={this.toggleUserInitiated}
                  checked={isUserInitiated}
                  role="button"
                  type="checkbox"
                />
                <SvgIcon size={20} {...searchIcon} />
                <span className="sr-only">Search</span>
              </label>
            </div>
          )}
      </Sticky>
    );
  }
}
