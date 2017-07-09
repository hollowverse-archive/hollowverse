import { css } from 'aphrodite/no-important';
import * as React from 'react';
import { EventSchema } from 'typings/dataSchema';
import { common } from 'common.styles';
import { sortByDescending, doesEventHaveQuote } from 'utils/utils';
import { styles } from './events.styles';

interface Props {
  data: EventSchema[];
}

class EventsClass extends React.PureComponent<Props, {}> {
  render() {
    return (
      <div className={css(styles.eventsContainer)}>
        {this.renderEvents()}
      </div>
    );
  }

  renderEvents() {
    if (this.props.data && this.props.data.length > 0) {
      const events = this.props.data;

      return sortByDescending(events, 'postedAt').map(event => {
        let quote;
        if (doesEventHaveQuote(event)) {
          quote = (
            <div className={css(common.textTypography, styles.eventContent)}>
              <a
                className={css(styles.sourceTypography)}
                href={event.sourceUrl}
              >
                <p>
                  {event.sourceName}
                </p>
              </a>
              <div className={css(styles.quoteContainer)}>
                <p className={css(styles.quotedText)}>
                  {event.quote}
                </p>
              </div>
            </div>
          );
        }

        return (
          <div
            className={css(common.textTypography, styles.eventContent)}
            key={event.userComment}
          >
            {quote}
            <p className={css(styles.userComment)}>
              {event.userComment}
            </p>
          </div>
        );
      });
    } else {
      return undefined;
    }
  }
}

export const Events = EventsClass;
