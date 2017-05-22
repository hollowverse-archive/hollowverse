import {css} from 'aphrodite/no-important'
import * as React from 'react'
import {sortByDescending} from '../../utils/utils'
import {common} from '../../common.styles'
import {styles} from './events.styles'
import {EventSchema} from '../../../../typings/dataSchema'

interface IProps {
  data: EventSchema[]
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
    if (this.props.data && this.props.data.length > 0) {
      const events = this.props.data

      return (
        sortByDescending(events, 'postedAt').map((event) =>
          <div className={css(common.textTypography, styles.eventContent)} key={event.id}>
            <a className={css(styles.sourceTypography)} href={event.sourceUrl}><p>{event.sourceName}</p></a>
            <div className={css(styles.quoteContainer)}>
              <p className={css(styles.quotedText)}>{event.quote}</p>
            </div>
            <p className={css(styles.userComment)}>{event.userComment}</p>
            {/*<div className={css(styles.userContainer)}>
              <img className={css(styles.userAvatar)} src={event.userAvatar} />
              <p className={css(styles.username)}>
                {event.userDisplayName}
              </p>
            </div>*/}
          </div>,
        )
      )
    } else {
      return undefined
    }
  }
}

export const Events = EventsClass
