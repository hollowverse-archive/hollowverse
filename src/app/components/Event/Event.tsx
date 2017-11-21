import * as React from 'react';
import cc from 'classcat';
import formatDate from 'date-fns/format';

import * as classes from './Event.module.scss';

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
      [classes.event]: true,
      [classes.self]: props.isQuoteByNotablePerson,
    })}
  >
    <div className={classes.eventContent}>
      {props.happenedOn ? (
        <div className={classes.eventDate}>
          {formatDate(props.happenedOn, 'MMM D, YYYY')}
        </div>
      ) : null}
      {props.isQuoteByNotablePerson && props.notablePerson ? (
        <div className={classes.eventCaption}>
          {props.notablePerson.name} said:
        </div>
      ) : null}
      <div className={classes.eventText}>{props.quote}</div>
      {props.sourceName ? (
        <div className={classes.eventSource}>
          Source: <a href={props.sourceUrl}>{props.sourceName}</a>
        </div>
      ) : null}
    </div>
  </div>
);
