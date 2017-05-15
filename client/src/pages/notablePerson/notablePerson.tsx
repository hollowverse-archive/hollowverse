import {css} from 'aphrodite/no-important'
import * as React from 'react'
import {RouteComponentProps} from 'react-router-dom'
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
    comment: string,
    addedBy: string,
  }[]
}

/* Todo:
  - [x] Custom Styles
  - [x] Custom Labels
    [ ] Add Events
  - [ ] Second pass for design & code optimization
*/

type ComponentProps = IProps & RouteComponentProps<any>

class NotablePersonClass extends React.Component<ComponentProps, undefined> {
  render() {
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
        <div className={css(styles.eventsContainer)}>
          {this.renderEvents()}
        </div>
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

  renderEvents() {
    const {notablePersonEvents} = data
    return (
      notablePersonEvents.map((event) =>
        <div className={css(styles.eventContent)} key={event.eventId}>
          <div className='mockQuoteSection'>
            <p>{event.eventQuote}</p>
            <a href={event.eventSource}>Source</a>
          </div>
          <p>{event.comment}</p>
          <p>{event.addedBy}</p>
        </div>,
      )
    )
  }
}

export const NotablePerson = NotablePersonClass
