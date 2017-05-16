import {css} from 'aphrodite/no-important'
import * as React from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {Events} from './events'
import {common} from '../../common.styles'
import {styles} from './notablePerson.styles'
import {data} from './dummyData'

interface IProps {
  notablePersonId: number
  notablePersonName: string
  notablePersonPictureUrl: string
  notablePersonLabels: string[]
  notablePersonEvents: {
    eventId: number,
    eventQuote: string,
    eventSource: string,
    eventSourceName: string,
    userComment: string,
    userAvatar: string,
    addedBy: string,
  }[]
}

/* Todo:
    [ ] Add Events
  - [ ] Second pass for design & code optimization
*/

/*
  Dummy data suggests that this top-level component will be accessing
  the data probably with a lifehook method.
  It then passes the necessary data to its children, like <Events>
*/

type ComponentProps = IProps & RouteComponentProps<any>

class NotablePersonClass extends React.Component<ComponentProps, undefined> {
  render() {
    const {notablePersonEvents} = data
    return (
      <div className={css(common.page)}>
        <div className={css(styles.notablePersonTitleContainer)}>
          <img className={css(styles.notablePersonPhoto)} src={data.notablePersonPictureUrl}/>
          <div className={css(styles.notablePersonText)}>
            <h1 className={css(styles.notablePersonTitle)}>Religion, politics, and ideas of...</h1>
            <h2 className={css(common.titleTypography, styles.notablePersonName)}>{data.notablePersonName}</h2>
            {this.renderLabels()}
          </div>
        </div>
        <Events data={data}/>
      </div>
    )
  }

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
}

export const NotablePerson = NotablePersonClass
