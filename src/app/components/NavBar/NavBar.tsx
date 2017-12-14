import * as React from 'react';

import { Sticky } from 'components/Sticky/Sticky';

import * as classes from './NavBar.module.scss';

type Props = {
  title: string;
};

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
              <a title={classes.title} className={classes.title} href="/">
                {title}
              </a>
            </div>
          )}
      </Sticky>
    );
  }
}
