import * as React from 'react';
import * as classNames from 'classnames';
import './styles.scss';

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
  comments: [
    {
      owner: {
        name: string;
        photoUrl: string;
      };
      text: string;
      postedAt: Date;
    }
  ];
};

const Event = (props: EventProps) => (
  <div className={classNames('event', { self: props.isQuoteByNotablePerson })}>
    <div className="event-content">
      <div className="event-date">{props.postedAt}</div>
      <div className="event-caption">
        {props.isQuoteByNotablePerson &&
          props.notablePerson &&
          `${props.notablePerson.name} said:`}
      </div>
      <div className="event-text">{props.quote}</div>
      {props.sourceName && (
        <div className="event-source">
          Source: <a href={props.sourceUrl}>{props.sourceName}</a>
        </div>
      )}
    </div>
    {props.comments.map(({ owner, text }) => (
      <div className="event-user-comment">
        {text}
        <div className="event-user-name">{owner.name}</div>
        <img
          className="event-user-avatar"
          alt={owner.name}
          src={owner.photoUrl}
        />
      </div>
    ))}
  </div>
);

export default Event;
