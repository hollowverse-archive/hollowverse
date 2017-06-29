import * as React from 'react';
import { connect } from 'react-redux';
import { actions } from '../store/actions';
import { State } from '../store/reducers';
import * as selectors from '../store/selectors';
import pick from 'lodash/pick';

interface IProps {
  userIsLoggedIn: boolean;
}

function mapStateToProps(state: State): IProps {
  return {
    userIsLoggedIn: selectors.getUserIsLoggedIn(state),
  };
}

const actionCreators = pick(actions, ['requestLogin']);
type ActionCreators = typeof actionCreators;

export function requireUserLogin(
  Component: React.ComponentClass<any>,
): React.ComponentClass<any> {
  class RequireUserLogin extends React.Component<
    IProps & ActionCreators,
    undefined
  > {
    render() {
      const { props: p } = this;

      if (!p.userIsLoggedIn) {
        return (
          <div className="padding8">
            <p>Please login first!</p>

            <p>
              <button className="searchButton" onClick={() => p.requestLogin()}>
                Login with Facebook
              </button>
            </p>

            <p>Hollowverse uses Facebook as the login provider</p>
          </div>
        );
      } else {
        return <Component {...this.props} />;
      }
    }
  }

  return connect(mapStateToProps, actionCreators)(RequireUserLogin);
}
