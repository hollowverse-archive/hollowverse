import {css} from 'aphrodite/no-important'
import * as React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Route, RouteComponentProps, Switch, withRouter} from 'react-router-dom'
import {ConnectedRouter} from 'react-router-redux'
import {GlobalSpinner} from '../components/globalSpinner'
import {Warning} from '../components/warning'
import {Homepage} from '../pages/homepage/homepage'
import {NotablePerson} from '../pages/notablePerson/notablePerson'
import {actions} from '../redux/actions'
import {State} from '../redux/reducers'
import {pick} from '../utils/utils'
import {styles} from './app.styles'
import {Header} from './header'

interface IProps {
  loginStatus: facebookSdk.LoginStatus,
  displayWarning: boolean
}

function mapStateToProps(state: State): IProps {
  return pick(state, [
    'loginStatus',
    'displayWarning',
  ])
}

const actionCreators = pick(actions, [
  'requestUpdateLoginStatus',
  'toggleWarning',
])

type ActionCreators = typeof actionCreators

class AppClass extends React.Component<ActionCreators & IProps & RouteComponentProps<any>, undefined> {
  componentDidMount() {
    // this.props.requestUpdateLoginStatus() // Not needed for V1.
    this.props.toggleWarning(true)
  }

  render() {
    const {props: p} = this
    return (
      <div className={css(styles.mainApp)}>
        <GlobalSpinner/>
        <Warning/>
        <Header/>
        <div className={css(styles.pageContent)}>
          <Switch>
            <Route exact path='/' component={Homepage}/>
            <Route exact path='/notable-person/:id' component={NotablePerson}/>
          </Switch>
        </div>
      </div>
    )
  }
}

export const App = connect(mapStateToProps, actionCreators)(withRouter(AppClass))
