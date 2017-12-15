import * as React from 'react';

import * as classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';

type Props = {
  title: string;
};

import searchIcon from 'icons/search.svg';
import backIcon from 'icons/back.svg';

export class NavBar extends React.PureComponent<Props> {
  render() {
    const { title } = this.props;

    return (
      <Sticky className={classes.navbar} height={48}>
        {isSticking =>
          isSticking ? (
            <div key="search" className={classes.search}>
              <form className={classes.searchForm}>
                <input
                  className={classes.searchInput}
                  type="search"
                  placeholder="Search for notable people..."
                />
              </form>
            </div>
          ) : (
            <div className={classes.logo}>
              <a title="Homepage" className={classes.title} href="/">
                {title}
              </a>
              <a className={classes.back} href="..">
                <SvgIcon size={20} {...backIcon} />
                <span className="sr-only">Go Back</span>
              </a>
              <label>
                <input aria-checked={false} type="checkbox" />
                <SvgIcon size={20} {...searchIcon} />
                <span className="sr-only">Search</span>
              </label>
            </div>
          )}
      </Sticky>
    );
  }
}
