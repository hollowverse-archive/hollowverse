import React from 'react';
import { hot } from 'react-hot-loader';
import cc from 'classcat';
import Helmet from 'react-helmet-async';
import { ConnectedNavBar } from 'components/NavBar/ConnectedNavBar';
import { Route, Switch, RouteProps } from 'react-router';
import { isWhitelistedPage } from 'redirectionMap';

import classes from './App.module.scss';

import { ScrollTo } from 'components/ScrollTo/ScrollTo';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'var(--font-family)',
  },
});

type State = {
  hasMounted: boolean;
};

type AppPath = '/search' | '/contact' | '/privacy-policy' | '/:slug';

export type AppRoutesMap = Record<AppPath | 'default', RouteProps['component']>;

type AppProps = {
  routesMap: AppRoutesMap;
};

const orderedPaths: AppPath[] = [
  '/search',
  '/contact',
  '/privacy-policy',
  '/:slug',
];

/**
 * Main app component
 */
export const App = class extends React.Component<AppProps, State> {
  state: State = {
    hasMounted: false,
  };

  componentDidMount() {
    this.setState({ hasMounted: true });
  }

  render() {
    const { hasMounted } = this.state;
    const { routesMap } = this.props;

    return (
      <div className={cc([classes.root, { 'no-js': !hasMounted }])}>
        <Helmet
          titleTemplate="%s - Hollowverse"
          defaultTitle="Hollowverse - Religion, politics and ideas of the influentials"
        >
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, shrink-to-fit=no"
          />
          <link
            rel="preconnect"
            href={__API_ENDPOINT__}
            crossOrigin="anonymous"
          />
          <meta name="theme-color" content="" />
        </Helmet>
        <MuiThemeProvider theme={theme}>
          <Route>
            {props => {
              if (!isWhitelistedPage(props.location.pathname)) {
                return (
                  <Helmet>
                    <meta name="robots" content="noindex" />
                  </Helmet>
                );
              }

              return null;
            }}
          </Route>
          <Route>
            {props => <ScrollTo updateKey={props.location.pathname} />}
          </Route>
          <Route>
            {props => <ConnectedNavBar {...props} title="Hollowverse" />}
          </Route>
          <div className={classes.view}>
            <Switch>
              {orderedPaths.map(path => (
                <Route key={path} path={path} component={routesMap[path]} />
              ))}
              <Route component={routesMap.default} />
            </Switch>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
};

export const HotApp = hot(module)(App);
