import React from 'react';
import cc from 'classcat';

import { RouteComponentProps, Route, Switch } from 'react-router';

import classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { NavBarButton, NavBarLink } from 'components/NavBar/NavBarButton';

import searchIcon from 'icons/search.svg';
import backIcon from 'icons/back.svg';
import { ConnectedSearchBar } from 'components/NavBar/ConnectedSearchBar';

import textLogo from '!!file-loader!assets/textLogo.svg';

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
  goBack = (_: React.MouseEvent<HTMLElement>) => {
    this.props.history.goBack();
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
          {isSticking => {
            return (
              <>
                <NavBarButton
                  disabled
                  onClick={this.goBack}
                  className={cc([classes.button, { [classes.isHidden]: true }])}
                >
                  <SvgIcon size={20} {...backIcon} />
                  <span className="sr-only">Go Back</span>
                </NavBarButton>
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
            );
          }}
        </Sticky>
      </div>
    );
  }
};
