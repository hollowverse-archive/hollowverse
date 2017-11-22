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
      {props.children}
      <div className={classes.eventMeta}>
        {props.happenedOn ? (
          <span className={classes.eventDate}>
            {formatDate(props.happenedOn, 'MMM D, YYYY')}
          </span>
        ) : null}
        {props.sourceName ? (
          <span className={classes.eventSource}>
            Source: <a href={props.sourceUrl}>{props.sourceName}</a>
          </span>
        ) : null}
      </div>
    </div>
  </div>
);
