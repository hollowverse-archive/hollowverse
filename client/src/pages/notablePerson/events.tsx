import * as React from 'react'
import {css} from 'aphrodite/no-important'
import {common} from '../../common.styles'
import {styles} from './events.styles'

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
        <div className={css(common.textTypography, styles.eventContent)} key={event.eventId}>
            <a className={css(styles.sourceTypography)} href={event.eventSource}>Source</a>
          <div className={css(styles.quoteContainer)}>
            <p className={css(styles.quotedText)}>{event.eventQuote}</p>
          </div>
          <p className={css(styles.userComment)}>{event.comment}</p>
          <p className={css(styles.username)}>{event.addedBy}</p>
        </div>,
      )
    )
  }
}

export const Events = EventsClass
