import * as React from 'react'
import {css} from 'aphrodite/no-important'
import {sortByDescending} from '../../utils/utils'
import {common} from '../../common.styles'
import {styles} from './events.styles'
import {Event} from '../../../../typings/dataSchema'

interface IProps {
  data: Event[]
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
    if (this.props.data.length > 0) {
      let events = this.props.data
      return (
        sortByDescending(events, 'postedAt').map((event) =>
          <div className={css(common.textTypography, styles.eventContent)} key={event.id}>
            <a className={css(styles.sourceTypography)} href={event.sourceUrl}><p>{event.sourceName}</p></a>
            <div className={css(styles.quoteContainer)}>
              <p className={css(styles.quotedText)}>{event.quote}</p>
            </div>
            <p className={css(styles.userComment)}>{event.userComment}</p>
            <div className={css(styles.userContainer)}>
              <img className={css(styles.userAvatar)} src={event.userAvatar} />
              <p className={css(styles.username)}>
                {event.userDisplayName}
              </p>
            </div>
          </div>,
        )
      )
    } else {
      return (
        <div></div>
      ) // Loading? Grayed Out Components? WIP.
    }
  }
}

export const Events = EventsClass
