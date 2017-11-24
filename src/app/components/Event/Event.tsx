import * as React from 'react';
import formatDate from 'date-fns/format';

import { Label } from 'components/Label/Label';

import { prettifyUrl } from 'helpers/prettifyUrl';

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
  entityName?: string | null;
  entityUrl?: string | null;
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
        {props.entityUrl && props.entityName ? (
          <span>
            <a title={props.entityName} href={props.entityUrl}>
              {prettifyUrl(props.entityUrl)}
            </a>
          </span>
        ) : null}
        {props.sourceName ? (
          <span>
            Source: <a href={props.sourceUrl}>{props.sourceName}</a>
          </span>
        ) : null}
        {props.happenedOn ? (
          <span>{formatDate(props.happenedOn, 'MMM D, YYYY')}</span>
        ) : null}
        <ul aria-label="Event labels" className={classes.labelList}>
          {props.labels.map(label => (
            <li key={label.id} className={classes.labelListItem}>
              <Label size="small" text={label.text} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
