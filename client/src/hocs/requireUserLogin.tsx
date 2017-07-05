import * as React from 'react';
import { connect } from 'react-redux';
import { requestLogin } from 'store/features/auth/actions';
import { StoreState as State } from 'store/types';
import * as selectors from 'store/selectors';

import { DefaultDispatchProps } from 'store/types';

interface StateProps {
  userIsLoggedIn: boolean;
}

function mapStateToProps(state: State): StateProps {
  return {
    userIsLoggedIn: selectors.getUserIsLoggedIn(state),
  };
}

type HOCProps = StateProps & DefaultDispatchProps;

export function requireUserLogin<OwnProps extends {}>(
  Component: React.ComponentClass<OwnProps>,
) {
  class RequireUserLogin extends React.PureComponent<HOCProps & OwnProps, {}> {
    handleLogin = () => {
      this.props.dispatch(requestLogin(undefined));
    };

    render() {
      const { userIsLoggedIn } = this.props;

      if (!userIsLoggedIn) {
        return (
          <div className="padding8">
            <p>Please login first!</p>

            <p>
              <button className="searchButton" onClick={this.handleLogin}>
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

  return connect<HOCProps & OwnProps, StateProps>(mapStateToProps)(
    RequireUserLogin,
  );
}
