import * as React from 'react';

import { Sticky } from 'components/Sticky/Sticky';

import * as classes from './NavBar.module.scss';

type Props = {
  title: string;
};

export class NavBar extends React.Component<Props> {
  render() {
    const { title } = this.props;

    return (
      <Sticky className={classes.navbar} height={48}>
        {isSticking =>
          !isSticking ? (
            <div className={classes.logo}>
              <a title={classes.title} className={classes.title} href="/">
                {title}
              </a>
            </div>
          ) : (
            <div key="search" className={classes.search}>
              <form>
                <input
                  type="search"
                  placeholder="Search for notable people..."
                />
              </form>
            </div>
          )}
      </Sticky>
    );
  }
}
