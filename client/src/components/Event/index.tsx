import * as React from 'react';
import cc from 'classcat';
import './styles.scss';
import formatDate from 'date-fns/format';

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
  <div className={cc({ event: true, self: props.isQuoteByNotablePerson })}>
    <div className="event-content">
      {props.happenedOn ? (
        <div className="event-date">
          {formatDate(props.happenedOn, 'MMM D, YYYY')}
        </div>
      ) : null}
      {props.isQuoteByNotablePerson && props.notablePerson ? (
        <div className="event-caption">{props.notablePerson.name} said:</div>
      ) : null}
      <div className="event-text">{props.quote}</div>
      {props.sourceName ? (
        <div className="event-source">
          Source: <a href={props.sourceUrl}>{props.sourceName}</a>
        </div>
      ) : null}
    </div>
  </div>
);
