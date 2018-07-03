import React from 'react';
import cc from 'classcat';

import { RouteComponentProps, Route, Switch } from 'react-router';
import { Button, Wrapper } from 'react-aria-menubutton';

import classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { NavBarLink, NavBarButton } from 'components/NavBar/NavBarButton';

import searchIcon from 'icons/search.svg';
import menuIcon from 'icons/menu.svg';
import textLogo from '!!file-loader!assets/textLogo.svg';

import viewerQuery from './ViewerQuery.graphql';

import { ConnectedSearchBar } from 'components/NavBar/ConnectedSearchBar';
import { ConnectedAppMenu } from 'components/AppMenu/ConnectedAppMenu';
import { WithData } from 'hocs/WithData/WithData';
import {
  AppDependenciesContext,
  AppDependencies,
} from 'appDependenciesContext';
import { ViewerQuery } from 'api/types';
import { AsyncResult } from 'helpers/asyncResults';

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

    document.body.classList.toggle('no-scroll');
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

  createLoadViewer = ({
    apiClient,
  }: Pick<AppDependencies, 'apiClient'>) => async () => {
    return apiClient.request<ViewerQuery>(viewerQuery);
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
              <AppDependenciesContext.Consumer>
                {({ apiClient }) => (
                  <WithData
                    dataKey="viewer"
                    load={this.createLoadViewer({ apiClient })}
                    requestId={null}
                  >
                    {({
                      result,
                    }: {
                      result: AsyncResult<ViewerQuery | null>;
                    }) => (
                      <Wrapper
                        id="app-menu-wrapper"
                        onMenuToggle={this.handleMenuToggle}
                        className={classes.menuWrapper}
                      >
                        <NavBarButton
                          className={classes.button}
                          Factory={Button}
                        >
                          <span ref={this.navBarChildRef}>
                            <SvgIcon size={20} {...menuIcon} />
                            <span className="sr-only">Main Menu</span>
                          </span>
                        </NavBarButton>
                        <ConnectedAppMenu
                          viewer={
                            result.value ? result.value.viewer : undefined
                          }
                          getMenuStyle={this.getMenuStyle}
                        />
                      </Wrapper>
                    )}
                  </WithData>
                )}
              </AppDependenciesContext.Consumer>
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
