import * as React from 'react';
import cc from 'classcat';

import { OptionalIntersectionObserver } from 'components/OptionalIntersectionObserver/OptionalIntersectionObserver';

import * as classes from './NavBar.module.scss';

type Props = {
  title: string;
};

type State = {
  isInView: boolean;
};

export class NavBar extends React.Component<Props, State> {
  state: State = {
    isInView: true,
  };

  handleChange = (isInView: boolean) => {
    this.setState({ isInView });
  };

  render() {
    const { title } = this.props;
    const { isInView } = this.state;

    return (
      <div
        className={cc([
          classes.root,
          classes.stickyContainer,
          { [classes.sticky]: !isInView },
        ])}
      >
        <OptionalIntersectionObserver
          threshold={1}
          rootId="header"
          onChange={this.handleChange}
        >
          <div className={classes.stickyPlaceholder} />
        </OptionalIntersectionObserver>
        <div className={cc([classes.navbar, classes.stickyElement])}>
          {isInView ? (
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
        </div>
      </div>
    );
  }
}
