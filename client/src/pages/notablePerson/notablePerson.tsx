import {css} from 'aphrodite/no-important'
import * as React from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {actions} from '../../redux/actions'
import {State} from '../../redux/reducers'
import {pick} from '../../utils/utils'
import {Events} from './events'
import {common} from '../../common.styles'
import {styles} from './notablePerson.styles'
import {NotablePersonSchema} from '../../../../typings/dataSchema'

interface IProps {
  notablePerson: NotablePersonSchema
}

function mapStateToProps(state: State): IProps {
  return {
    notablePerson: state.notablePerson,
  }
}

const actionCreators = pick(actions, [
  'requestNotablePerson',
])

type ActionCreators = typeof actionCreators
type ComponentProps = ActionCreators & IProps & RouteComponentProps<any>

class NotablePersonClass extends React.Component<ComponentProps, undefined> {
  componentDidMount() {
    const {props: p} = this
    // TODO: We'll pass the query string to below function:
    p.requestNotablePerson()
  }
  render() {
    const {name, photoUrl, labels} = this.props.notablePerson

    return (
      <div className={css(common.page)}>
        <div className={css(styles.notablePersonTitleContainer)}>
          <img className={css(styles.notablePersonPhoto)} src={photoUrl}/>
          <div className={css(styles.notablePersonText)}>
            <h1 className={css(styles.notablePersonTitle)}>Religion, politics, and ideas of...</h1>
            <h2 className={css(common.titleTypography, styles.notablePersonName)}>{name}</h2>
            {/*{this.renderLabels()}*/}
          </div>
        </div>
        {/*<Events data={data}/>*/}
      </div>
    )
  }
/* // TODO: We'll address possibility of undefined
  renderLabels() {
    const {labels} = this.props.notablePerson
    return (
      labels.map((label, i) =>
        <span className={css(styles.notablePersonLabel)} key={i}>
          {label}
        </span>,
      )
    )
  }
*/
}
export const NotablePerson = connect<IProps, ActionCreators, RouteComponentProps<any>>(
  mapStateToProps,
  actionCreators,
  )(NotablePersonClass)
