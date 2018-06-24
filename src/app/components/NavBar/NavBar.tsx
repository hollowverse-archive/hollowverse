import React from 'react';
import cc from 'classcat';
import noScroll from 'no-scroll';

import { RouteComponentProps, Route, Switch } from 'react-router';
import { Button, Wrapper } from 'react-aria-menubutton';

import classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { NavBarLink, NavBarButton } from 'components/NavBar/NavBarButton';

import searchIcon from 'icons/search.svg';
import menuIcon from 'icons/menu.svg';
import { ConnectedSearchBar } from 'components/NavBar/ConnectedSearchBar';

import textLogo from '!!file-loader!assets/textLogo.svg';
import { AppMenu } from '../AppMenu/AppMenu';

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
  showMenu = (_: React.MouseEvent<HTMLElement>) => {
    // this.props.history.goBack();
  };

  handleMenuToggle = () => {
    noScroll.toggle();
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
              <Wrapper
                onMenuToggle={this.handleMenuToggle}
                className={classes.menuWrapper}
              >
                <NavBarButton className={classes.button} Factory={Button}>
                  <SvgIcon size={20} {...menuIcon} />
                  <span className="sr-only">Menu</span>
                </NavBarButton>
                <AppMenu isOpen user={undefined} />
              </Wrapper>
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
