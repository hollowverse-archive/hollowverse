import * as React from 'react';
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
  children?: JSX.Element | JSX.Element[] | string;
};

export const Event = (props: EventProps) => (
  <div className={classes.event}>
    <div className={classes.eventContent}>
      {props.happenedOn ? (
        <div className={classes.eventDate}>
          {formatDate(props.happenedOn, 'MMM D, YYYY')}
        </div>
      ) : null}
      {props.children}
      {props.sourceName ? (
        <div className={classes.eventSource}>
          Source: <a href={props.sourceUrl}>{props.sourceName}</a>
        </div>
      ) : null}
    </div>
  </div>
);
