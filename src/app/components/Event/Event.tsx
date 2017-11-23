import * as React from 'react';
import formatDate from 'date-fns/format';

import { Label } from 'components/Label/Label';

import * as classes from './Event.module.scss';

type EventProps = {
  postedAt: Date | null;
  happenedOn: Date | null;
  notablePerson: {
    name: string;
    photoUrl: string;
  } | null;
  sourceName: string;
  sourceUrl: string;
  labels: Array<{
    id: string;
    text: string;
  }>;
  children?: JSX.Element | JSX.Element[] | string | null;
};

export const Event = (props: EventProps) => (
  <div className={classes.event}>
    <div className={classes.eventContent}>
      {props.children}
      <div className={classes.eventMeta}>
        <div className={classes.labels}>
          {props.labels.map(label => (
            <Label key={label.id} size="small" text={label.text} />
          ))}
        </div>
        <div>
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
  </div>
);
