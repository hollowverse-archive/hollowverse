import * as React from 'react'
import {css} from 'aphrodite/no-important'
import {common} from '../../common.styles'
import {styles} from './notablePerson.styles'

interface IProps {
  data: {
    notablePersonEvents: {
      eventId: number,
      eventQuote: string,
      eventSource: string,
      comment: string,
      addedBy: string,
    }[],
  }
}

class EventsClass extends React.Component<IProps, undefined> {
  render() {
    return (
      <div className={css(styles.eventsContainer)}>
        {this.renderEvents()}
      </div>
    )
  }
  renderEvents() {
    const {notablePersonEvents} = this.props.data
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

export const Events = EventsClass
