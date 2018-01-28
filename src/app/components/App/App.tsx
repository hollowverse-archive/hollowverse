// tslint:disable:react-a11y-titles
import * as React from 'react';
import cc from 'classcat';
// @ts-ignore
import Helmet from 'react-helmet-async';
import { ConnectedNavBar } from 'components/NavBar/ConnectedNavBar';
import { Route, Switch } from 'react-router';

import './App.global.scss';
import * as classes from './App.module.scss';

import { LoadableNotablePerson } from 'pages/NotablePerson/LoadableNotablePerson';
import { LoadableSearchResults } from 'pages/SearchResults/LoadableSearchResults';
import { LoadableAbout } from 'pages/About/LoadableAbout';
import { LoadablePrivacyPolicy } from 'pages/PrivacyPolicy/LoadablePrivacyPolicy';
import { LoadableHome } from 'pages/Home/LoadableHome';

type State = {
  hasMounted: boolean;
};

/**
 * Main app component
 */
export const App = class extends React.Component<{}, State> {
  state: State = {
    hasMounted: false,
  };

  componentDidMount() {
    this.setState({ hasMounted: true });
  }

  render() {
    const { hasMounted } = this.state;

    return (
      <div className={cc([classes.root, { 'no-js': hasMounted }])}>
        <Helmet>
          <title>
            Hollowverse - Religion, politics and ideas of notable people
          </title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, shrink-to-fit=no"
          />
          <meta name="robots" content="noindex" />
          <meta charSet="utf-8" />
        </Helmet>
        <Route>
          {props => <ConnectedNavBar {...props} title="Hollowverse" />}
        </Route>
        <div className={classes.view}>
          <Switch>
            <Route path="/search" component={LoadableSearchResults} />
            <Route path="/about" component={LoadableAbout} />
            <Route path="/privacy-policy" component={LoadablePrivacyPolicy} />
            <Route path="/:slug" component={LoadableNotablePerson} />
            <Route component={LoadableHome} />
          </Switch>
        </div>
      </div>
    );
  }
};
