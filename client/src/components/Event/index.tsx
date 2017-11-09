import * as React from 'react';
import * as classNames from 'classnames';
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
  comments: Array<{
    id?: string;
    owner: {
      name: string;
      photoUrl: string | null;
    };
    text: string;
  }> | null;
};

export const Event = (props: EventProps) => (
  <div className={classNames('event', { self: props.isQuoteByNotablePerson })}>
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
    {props.comments
      ? props.comments.map(({ id, owner, text }) => (
          <div key={id} className="event-user-comment">
            {text}
            <div className="event-user-name">{owner.name}</div>
            {owner.photoUrl ? (
              <img
                className="event-user-avatar"
                alt={owner.name}
                src={owner.photoUrl}
              />
            ) : null}
          </div>
        ))
      : null}
  </div>
);
