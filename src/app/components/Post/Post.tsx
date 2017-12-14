import * as React from 'react';
import formatDate from 'date-fns/format';

import { Label } from 'components/Label/Label';

import { prettifyUrl } from 'helpers/prettifyUrl';

import * as classes from './Post.module.scss';

type PostProps = {
  postedAt: Date | null;
  happenedOn: Date | null;
  title: string | JSX.Element;
  photoUrl: string | null;
  sourceName: string;
  sourceUrl: string;
  organizationName?: string | null;
  organizationWebsiteUrl?: string | null;
  labels: Array<{
    id: string;
    text: string;
  }>;
  children?: JSX.Element | null | Array<JSX.Element | null> | string;
};

export const Post = ({
  photoUrl,
  title,
  sourceName,
  labels,
  sourceUrl,
  happenedOn,
  children,
  organizationName,
  organizationWebsiteUrl,
}: PostProps) => (
  <div className={classes.root}>
    <div className={classes.header}>
      {photoUrl ? (
        <img
          className={classes.avatar}
          src={photoUrl}
          alt={undefined}
          role="presentation"
        />
      ) : null}
      <div className={classes.headerText}>
        <div className={classes.title}>{title}</div>
        <div className={classes.metadata}>
          {happenedOn ? (
            <time dateTime={happenedOn.toISOString()}>
              {formatDate(happenedOn, 'MMM D, YYYY')}
            </time>
          ) : null}
          {sourceName ? (
            <span>
              Source: <a href={sourceUrl}>{sourceName}</a>
            </span>
          ) : null}
        </div>
      </div>
    </div>
    <div className={classes.content}>{children}</div>
    <div className={classes.metadata}>
      {organizationWebsiteUrl && organizationName ? (
        <span>
          <a title={organizationName} href={organizationWebsiteUrl}>
            {prettifyUrl(organizationWebsiteUrl)}
          </a>
        </span>
      ) : null}
      {labels.length > 0 ? (
        <ul aria-label="Post labels" className={classes.labelList}>
          {labels.map(label => (
            <li key={label.id} className={classes.labelListItem}>
              <Label size="small" text={label.text} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  </div>
);
