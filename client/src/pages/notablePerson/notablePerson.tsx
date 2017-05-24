import {css} from 'aphrodite/no-important'
import * as React from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {connect} from 'react-redux'
import {actions} from '../../redux/actions'
import {State} from '../../redux/reducers'
import * as selectors from '../../redux/selectors'
import {pick} from '../../utils/utils'
import {NotablePersonSchema} from '../../../../typings/dataSchema'
import {ShadowComponent} from './shadowComponent'
import {Events} from './events'
import {common} from '../../common.styles'
import {styles} from './notablePerson.styles'

interface IProps {
  notablePerson: NotablePersonSchema | undefined
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
    const {props: p} = this // TODO: We'll pass the route parameters to below function:
    p.requestNotablePerson('/notablePersons/np_48d700ee')
  }

  render() {
    if (this.props.notablePerson) {
      const {name, photoUrl, labels, events} = this.props.notablePerson

      return (
        <div className={css(common.page)}>
          <div className={css(styles.notablePersonTitleContainer)}>
            <img className={css(styles.notablePersonPhoto)} width='200' height='200' src={photoUrl} />
            <div className={css(styles.notablePersonText)}>
              <h1 className={css(styles.notablePersonTitle)}>Religion, politics, and ideas of...</h1>
              <h2 className={css(common.titleTypography, styles.notablePersonName)}>{name}</h2>
              {this.renderLabels(labels)}
            </div>
          </div>
          <Events data={events}/>
        </div>
      )
    } else {
      return <ShadowComponent/>
    }
  }

  renderLabels(labels: string[]) {
    if (labels && labels.length > 0) {
      return (
        labels.map((label, i) =>
          <span className={css(styles.notablePersonLabel)} key={i}>
            {label}
          </span>,
        )
      )
    } else {
      return undefined
    }
  }

}

export const NotablePerson = connect<IProps, ActionCreators, RouteComponentProps<any>>(
  mapStateToProps,
  actionCreators,
  )(NotablePersonClass)
