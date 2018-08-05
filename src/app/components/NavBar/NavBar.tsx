import React from 'react';
import cc from 'classcat';

import { RouteComponentProps, Route, Switch } from 'react-router';

import classes from './NavBar.module.scss';

import { Sticky } from 'components/Sticky/Sticky';

import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import textLogo from '!!file-loader!assets/textLogo.svg';

import { ConnectedSearchBar } from 'components/NavBar/ConnectedSearchBar';
// import { ConnectedAppMenu } from 'components/AppMenu/ConnectedAppMenu';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ConnectedAppMenu } from 'components/AppMenu/ConnectedAppMenu';

export type OwnProps = {
  title: string;
};

export type StateProps = {
  shouldFocusSearch: boolean;
  isHomePage: boolean;
  shouldShowGlobalProgress: boolean;
};

export type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

export const NavBar = class extends React.Component<
  Props & RouteComponentProps<any>
> {
  render() {
    const {
      title,
      shouldFocusSearch,
      shouldShowGlobalProgress,
      isHomePage,
    } = this.props;

    return (
      <Sticky rootMargin="30% 0% 0% 0%" height={48}>
        {isSticking => (
          <>
            <AppBar
              position="static"
              color="inherit"
              style={{
                alignItems: 'center',
              }}
            >
              <Toolbar variant="dense" className={classes.maxWidth}>
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
                        <Tooltip title="Search">
                          <IconButton
                            aria-label="Search"
                            className={cc([{ [classes.isHidden]: isHomePage }])}
                            component={Link as any}
                            {...{ to: '/search' } as any}
                          >
                            <SearchIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Route>
                </Switch>
              </Toolbar>
              <LinearProgress
                style={{
                  visibility: shouldShowGlobalProgress ? undefined : 'hidden',
                  width: '100%',
                  height: '1px',
                }}
              />
            </AppBar>
          </>
        )}
      </Sticky>
    );
  }
};
