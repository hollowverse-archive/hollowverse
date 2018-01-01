import * as React from 'react';
import cc from 'classcat';

import { RouteComponentProps, Route, Switch } from 'react-router';

import * as classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { NavBarButton, NavBarLink } from 'components/NavBar/NavBarButton';

import searchIcon from 'icons/search.svg';
import backIcon from 'icons/back.svg';
import { ConnectedSearchView } from 'components/NavBar/ConnectedSearchView';

import textLogo from '!!file-loader!assets/textLogo.svg';
import { AsyncComponent } from 'hocs/AsyncComponent/AsyncComponent';
import { loadIntersectionObserverPolyfill } from 'helpers/loadPolyfill';

export type OwnProps = {
  title: string;
};

export type StateProps = {
  shouldFocusSearch: boolean;
  isHomePage: boolean;
};

export type DispatchProps = {
  goToSearch(): any;
  setShouldFocusSearch(isFocused: boolean): any;
};

type Props = OwnProps & StateProps & DispatchProps;

export const NavBar = class extends React.Component<
  Props & RouteComponentProps<any>
> {
  goBack = (_: React.MouseEvent<HTMLElement>) => {
    this.props.history.goBack();
  };

  render() {
    const { title, shouldFocusSearch, isHomePage, history } = this.props;

    const shouldHideBackButton =
      __IS_SERVER__ || isHomePage || history.length === 0;

    return (
      <div className={classes.root}>
        <AsyncComponent load={loadIntersectionObserverPolyfill}>
          {() => (
            // The component can work without `IntersectionObserver` polyfill,
            // render regradless of the load progress status
            <Sticky innerClassName={classes.viewWrapper} height={48}>
              {isSticking => {
                return [
                  <NavBarButton
                    disabled={shouldHideBackButton}
                    onClick={this.goBack}
                    className={cc([
                      classes.button,
                      { [classes.isHidden]: shouldHideBackButton },
                    ])}
                  >
                    <SvgIcon size={20} {...backIcon} />
                    <span className="sr-only">Go Back</span>
                  </NavBarButton>,
                  <div className={classes.view}>
                    <Switch>
                      <Route path="/search">
                        <ConnectedSearchView />
                      </Route>
                      <Route>
                        {isSticking || shouldFocusSearch ? (
                          <ConnectedSearchView />
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
                  </div>,
                ];
              }}
            </Sticky>
          )}
        </AsyncComponent>
      </div>
    );
  }
};
