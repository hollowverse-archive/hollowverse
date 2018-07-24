import React from 'react';
import cc from 'classcat';

import { RouteComponentProps, Route, Switch } from 'react-router';

import classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';

import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import textLogo from '!!file-loader!assets/textLogo.svg';

import { ConnectedSearchBar } from 'components/NavBar/ConnectedSearchBar';
import { ConnectedAppMenu } from 'components/AppMenu/ConnectedAppMenu';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

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
  render() {
    const { title, shouldFocusSearch, isHomePage } = this.props;

    return (
      <Sticky rootMargin="30% 0% 0% 0%" height={56}>
        {isSticking => (
          <>
            <AppBar
              position="static"
              // elevation={isSticking ? 1 : 0}
              color="inherit"
            >
              <Toolbar>
                <ConnectedAppMenu />
                <Switch>
                  <Route path="/search">
                    <ConnectedSearchBar />
                  </Route>
                  <Route>
                    {isSticking || shouldFocusSearch ? (
                      <ConnectedSearchBar />
                    ) : (
                      <>
                        <div className={classes.logoWrapper}>
                          <Link
                            title="Homepage"
                            className={classes.logo}
                            to="/"
                          >
                            <img src={textLogo} alt={title} />
                          </Link>
                        </div>
                        <IconButton
                          aria-label="Search"
                          className={cc([{ [classes.isHidden]: isHomePage }])}
                          component={Link as any}
                          {...{ to: '/search' } as any}
                        >
                          <SearchIcon />
                        </IconButton>
                      </>
                    )}
                  </Route>
                </Switch>
              </Toolbar>
            </AppBar>
          </>
        )}
      </Sticky>
    );
  }
};
