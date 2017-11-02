import * as React from 'react';
import NavBar from 'components/NavBar';
import './styles.scss';

export class App extends React.Component<{}, {}> {
  render() {
    return (
      <div className="app">
        <NavBar title="Hollowverse" />
        <div className="app-view">{this.props.children}</div>
      </div>
    );
  }
}
