import * as React from 'react';
import cc from 'classcat';
import formatDate from 'date-fns/format';

import styles from './Event.module.scss';

type EventProps = {
  quote: string;
  postedAt: Date | null;
  happenedOn: Date | null;
  notablePerson: {
    name: string;
    photoUrl: string;
  } | null;
  isQuoteByNotablePerson: boolean;
  sourceName: string;
  sourceUrl: string;
};

export const Event = (props: EventProps) => (
  <div
    className={cc({
      [styles.event]: true,
      [styles.self]: props.isQuoteByNotablePerson,
    })}
  >
    <div className={styles['event-content']}>
      {props.happenedOn ? (
        <div className={styles['event-date']}>
          {formatDate(props.happenedOn, 'MMM D, YYYY')}
        </div>
      ) : null}
      {props.isQuoteByNotablePerson && props.notablePerson ? (
        <div className={styles['event-caption']}>
          {props.notablePerson.name} said:
        </div>
      ) : null}
      <div className={styles['event-text']}>{props.quote}</div>
      {props.sourceName ? (
        <div className={styles['event-source']}>
          Source: <a href={props.sourceUrl}>{props.sourceName}</a>
        </div>
      ) : null}
    </div>
  </div>
);
