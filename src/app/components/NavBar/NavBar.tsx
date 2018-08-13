import React from 'react';
import cc from 'classcat';

import { RouteComponentProps, Route, Switch } from 'react-router';

import { Sticky } from 'components/Sticky/Sticky';

import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import textLogo from '!!file-loader!assets/textLogo.svg';

import { ConnectedSearchBar } from 'components/NavBar/ConnectedSearchBar';
import { ConnectedAppMenu } from 'components/AppMenu/ConnectedAppMenu';

import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    isHidden: {
      visibility: 'hidden',
    },
    maxWidth: {
      width: '100%',
      maxWidth: theme.breakpoints.values.sm,
    },
    logoWrapper: {
      animation: 'navbar-switch 0.15s',
      display: 'flex',
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      display: 'flex',
      textTransform: 'uppercase',
      letterSpacing: 1,
      '@supports (-webkit-background-clip: text)': {
        background: `linear-gradient(
            50deg,
            #4cfde9 0%,
            #fbc954 50%,
            #4435f7 120%
          )`,
        color: 'transparent',
        backgroundClip: 'text',
      },
    },
    '@keyframes navbar-switch': {
      from: {
        opacity: 0,
        transform: 'translateY(10px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  });

export type OwnProps = {
  title: string;
};

export type StateProps = {
  shouldFocusSearch: boolean;
  isHomePage: boolean;
  shouldShowGlobalProgress: boolean;
};

export type DispatchProps = {};

type Props = OwnProps &
  StateProps &
  DispatchProps &
  WithStyles<ReturnType<typeof styles>>;

export const NavBar = withStyles(styles)(
  class extends React.Component<Props & RouteComponentProps<any>> {
    render() {
      const {
        title,
        shouldFocusSearch,
        shouldShowGlobalProgress,
        isHomePage,
        classes,
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
                              className={cc([
                                { [classes.isHidden]: isHomePage },
                              ])}
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
  },
);
