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
  children?: JSX.Element | null | Array<JSX.Element | null> | string;
};

export const Event = (props: EventProps) => (
  <div className={classes.event}>
    <div className={classes.eventContent}>
      {props.children}
      <div className={classes.eventMeta}>
        {props.sourceName ? (
          <span className={classes.eventSource}>
            Source: <a href={props.sourceUrl}>{props.sourceName}</a>
          </span>
        ) : null}
        {props.happenedOn ? (
          <span className={classes.eventDate}>
            {formatDate(props.happenedOn, 'MMM D, YYYY')}
          </span>
        ) : null}
        <span className={classes.labels}>
          {props.labels.map(label => (
            <Label key={label.id} size="small" text={label.text} />
          ))}
        </span>
      </div>
    </div>
  </div>
);
