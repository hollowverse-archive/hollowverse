import { css } from 'aphrodite/no-important';
import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalSpinner } from 'components/globalSpinner';
import { Warning } from 'components/warning';
import { actions } from 'store/actions';
import { State } from 'store/reducers';
import pick from 'lodash/pick';
import { styles } from './app.styles';
import { Header } from './header';

interface IProps {
  loginStatus: facebookSdk.LoginStatus;
  displayWarning: boolean;
}

function mapStateToProps(state: State): IProps {
  return pick(state, ['loginStatus', 'displayWarning']);
}

const actionCreators = pick(actions, [
  'requestUpdateLoginStatus',
  'toggleWarning',
]);

type ActionCreators = typeof actionCreators;

class AppClass extends React.PureComponent<ActionCreators & IProps, {}> {
  componentDidMount() {
    this.props.requestUpdateLoginStatus();
    this.props.toggleWarning(true);
  }
  render() {
    return (
      <div className={css(styles.mainApp)}>
        <GlobalSpinner />
        <Header />
        <Warning />
        <div className={css(styles.pageContent)}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export const App = connect(mapStateToProps, actionCreators)(AppClass);
