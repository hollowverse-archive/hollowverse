import React from 'react';
import { hot } from 'react-hot-loader';
import cc from 'classcat';
import Helmet from 'react-helmet-async';
import { ConnectedNavBar } from 'components/NavBar/ConnectedNavBar';
import { Route, Switch, RouteProps } from 'react-router';
import { isWhitelistedPage } from 'redirectionMap';

import { ScrollTo } from 'components/ScrollTo/ScrollTo';
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

type State = {
  hasMounted: boolean;
};

type AppPath =
  | '/search'
  | '/contact'
  | '/privacy-policy'
  | '/:slug'
  | '/moderation';

export type AppRoutesMap = Record<AppPath | 'default', RouteProps['component']>;

const styles = (theme: Theme) =>
  createStyles({
    '@global': {
      ':root': {
        '--font-family':
          'system-ui, -apple-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      },
      '*, *::after, *::before': {
        border: 0,
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
      },
      html: {
        width: '100%',
        minHeight: '100vh',
      },
      body: {
        width: '100%',
        minHeight: '100%',
        minWidth: 320,
        position: 'relative',
        fontFamily: 'var(--font-family)',
      },
      'input, button, textarea': {
        fontFamily: 'var(--font-family)',
      },
      a: {
        textDecoration: 'none',
        transition: 'color 0.2s ease-in-out',
        color: theme.palette.primary.main,
      },
      sup: {
        fontSize: '0.7em',
      },
      /**
       * Visible on screen readers only
       * @see https://accessibility.18f.gov/hidden-content/
       */
      '.sr-only': {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        width: 1,
      },
      // The `focus-visible` package provides the classes `.js-focus-visible`
      // and `.focus-visible`.
      // It is used to disable the "focus ring" style around buttons and links
      // when interacting with the page using the mouse, but still keep it
      // when using the keyboard for accessibility purposes.
      // The class is a polyfill for the `:focus-visible` pseudo-selector which
      // is still a proposal.
      'input[type="text"], input[type="search"], .js-focus-visible :focus:not(.focus-visible)': {
        outline: 'none',
      },
      input: {
        fontSize: 'inherit !important',
      },
      'input[type="search"]': {
        appearance: 'none',
        '-webkit-appearance': 'none',
      },
      h1: {
        margin: 0,
      },
    },
    root: {
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    view: {
      width: '100%',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        flexGrow: 1,
      },
    },
  });

type AppProps = {
  routesMap: AppRoutesMap;
} & WithStyles<ReturnType<typeof styles>>;

const orderedPaths: AppPath[] = [
  '/search',
  '/contact',
  '/privacy-policy',
  '/moderation',
  '/:slug',
];

/**
 * Main app component
 */
export const App = withStyles(styles)<AppProps>(
  class extends React.Component<AppProps, State> {
    state: State = {
      hasMounted: false,
    };

    componentDidMount() {
      this.setState({ hasMounted: true });
    }

    render() {
      const { hasMounted } = this.state;
      const { routesMap, classes } = this.props;

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
          <CssBaseline>
            <>
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
            </>
          </CssBaseline>
        </div>
      );
    }
  },
);

export const HotApp = hot(module)(App);
