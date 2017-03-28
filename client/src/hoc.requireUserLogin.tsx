import * as React from "react";
import {connect} from 'react-redux'
import {actions} from './redux.actions'
import {State} from './redux.reducers'
import {pick} from './utils'
import * as selectors from './redux.selectors'

interface Props {
  userIsLoggedIn: boolean
}

function mapStateToProps(state: State): Props {
  return {
    userIsLoggedIn: selectors.getUserIsLoggedIn(state)
  }
}

const actionCreators = pick(actions, [
  'requestLogin'
])
type ActionCreators = typeof actionCreators

export function requireUserLogin(Component: React.ComponentClass<any>): React.ComponentClass<any> {
  class RequireUserLogin extends React.Component<Props & ActionCreators, undefined> {
    render() {
      const {props: p} = this

      if (!p.userIsLoggedIn) {
        return (
          <div className='padding8'>
            <p>Please login first!</p>

            <p>
              <button className='searchButton' onClick={() => p.requestLogin()}>
                Login with Facebook
              </button>
            </p>

            <p>Hollowverse uses Facebook as the login provider</p>
          </div>
        )
      } else {
        return <Component {...this.props}/>
      }
    }
  }

  return connect(mapStateToProps, actionCreators)(RequireUserLogin)
}
