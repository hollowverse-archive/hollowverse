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
import {data} from './dummyData'

export interface PilotData {
  notablePersonId: number,
  notablePersonName: string,
  notablePersonPictureUrl: string,
  notablePersonLabels: string[],
  notablePersonEvents: {
    eventId: number,
    eventQuote: string,
    eventSource: string,
    eventSourceName: string,
    userComment: string,
    userAvatar: string,
    postedBy: string,
    postedAt: number,
  }[]
}

interface IProps {
  pilotData: PilotData | {}
}

function mapStateToProps(state: State): IProps {
  return pick(state, [
    'pilotData',
  ])
}

const actionCreators = pick(actions, [
  'requestPilotData',
])

type ActionCreators = typeof actionCreators
type ComponentProps = ActionCreators & IProps & RouteComponentProps<any>

class NotablePersonClass extends React.Component<ComponentProps, undefined> {
  componentDidMount() {
    const {props: p} = this
    p.requestPilotData()
  }
  render() {

    return (
      <div className={css(common.page)}>
        <div className={css(styles.notablePersonTitleContainer)}>
          <img className={css(styles.notablePersonPhoto)} src={data.notablePersonPictureUrl}/>
          <div className={css(styles.notablePersonText)}>
            <h1 className={css(styles.notablePersonTitle)}>Religion, politics, and ideas of...</h1>
            <h2 className={css(common.titleTypography, styles.notablePersonName)}>{data.notablePersonName}</h2>
            {/*{this.renderLabels()}*/}
          </div>
        </div>
        <Events data={data}/>
      </div>
    )
  }
/*
  renderLabels() {
    const {notablePersonLabels} = data
    return (
      notablePersonLabels.map((label, i) =>
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
