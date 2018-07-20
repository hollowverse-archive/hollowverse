import React from 'react';
import cc from 'classcat';
import noScroll from 'no-scroll';

import { RouteComponentProps, Route, Switch } from 'react-router';

import classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { NavBarLink } from 'components/NavBar/NavBarButton';

import searchIcon from 'icons/search.svg';
import textLogo from '!!file-loader!assets/textLogo.svg';

import { ConnectedSearchBar } from 'components/NavBar/ConnectedSearchBar';
import { ConnectedAppMenu } from 'components/AppMenu/ConnectedAppMenu';

export type OwnProps = {
  title: string;
};

export type StateProps = {
  shouldFocusSearch: boolean;
  isHomePage: boolean;
};

export type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

export const NavBar = class extends React.Component<
  Props & RouteComponentProps<any>
> {
  navBarChildRef = React.createRef<HTMLSpanElement>();

  handleMenuToggle = () => {
    if (navigator.userAgent.match(/iphone|ipad/i)) {
      return;
    }

    noScroll.toggle();
  };

  getMenuStyle = () => {
    let top = 0;
    let left = 0;
    const ref = this.navBarChildRef.current;

    if (ref) {
      ({ top, left } = ref.getBoundingClientRect());
    }

    return { '--top': `${top}px`, '--left': `${left}px` };
  };

  render() {
    const { title, shouldFocusSearch, isHomePage } = this.props;

    return (
      <div className={classes.root}>
        <Sticky
          rootMargin="30% 0% 0% 0%"
          innerClassName={classes.viewWrapper}
          height={48}
        >
          {isSticking => (
            <>
              <ConnectedAppMenu />
              <div className={classes.view}>
                <Switch>
                  <Route path="/search">
                    <ConnectedSearchBar />
                  </Route>
                  <Route>
                    {isSticking || shouldFocusSearch ? (
                      <ConnectedSearchBar />
                    ) : (
                      <div className={classes.logoViewInner}>
                        <div className={classes.logoWrapper}>
                          <NavBarLink
                            title="Homepage"
                            className={classes.logo}
                            to="/"
                          >
                            <img src={textLogo} alt={title} />
                          </NavBarLink>
                        </div>
                        <NavBarLink
                          className={cc([
                            classes.button,
                            { [classes.isHidden]: isHomePage },
                          ])}
                          to="/search"
                        >
                          <SvgIcon size={20} {...searchIcon} />
                          <span className="sr-only">Search</span>
                        </NavBarLink>
                      </div>
                    )}
                  </Route>
                </Switch>
              </div>
            </>
          )}
        </Sticky>
      </div>
    );
  }
};
