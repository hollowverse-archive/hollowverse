import * as React from 'react';
import NavBar from 'components/NavBar';
import './styles.scss';

/** Main app component */
export class App extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className="app">
        <NavBar title="Hollowverse" />
        <div className="app-view">{this.props.children}</div>
      </div>
    );
  }
}
