import * as React from 'react'
import {css} from 'aphrodite/no-important'
import {sortByDescending} from '../../utils/utils'
import {common} from '../../common.styles'
import {styles} from './events.styles'

interface IProps {
  data: {
    notablePersonEvents: {
      eventId: number,
      eventQuote: string,
      eventSource: string,
      eventSourceName: string,
      userComment: string,
      userAvatar: string,
      postedBy: string,
      postedAt: number,
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
      sortByDescending(notablePersonEvents, 'postedAt').map((event) =>
        <div className={css(common.textTypography, styles.eventContent)} key={event.eventId}>
          <a className={css(styles.sourceTypography)} href={event.eventSource}><p>{event.eventSourceName}</p></a>
          <div className={css(styles.quoteContainer)}>
            <p className={css(styles.quotedText)}>{event.eventQuote}</p>
          </div>
          <p className={css(styles.userComment)}>{event.userComment}</p>
          {/*<div className={css(styles.userContainer)}>
            <img className={css(styles.userAvatar)} src={event.userAvatar} />
            <p className={css(styles.username)}>
              {event.postedBy}
            </p>
          </div>*/}
        </div>,
      )
    )
  }
}

export const Events = EventsClass
