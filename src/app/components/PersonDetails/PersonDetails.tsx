import * as React from 'react';
import { Label } from 'components/Label/Label';
import { Image } from 'components/Image/Image';
import * as classes from './PersonDetails.module.scss';

type PersonDetailsProps = {
  summary: string | null;
  name: string;
  photoUrl: string | null;
  labels?: Array<{ text: string; id: string }>;
};

export const PersonDetails = ({
  summary,
  name,
  photoUrl,
  labels,
}: PersonDetailsProps) => (
  <div className={classes.root}>
    {photoUrl ? (
      <div
        style={{ backgroundImage: `url(${photoUrl})` }}
        aria-hidden
        className={classes.coverPhoto}
      />
    ) : null}
    <div className={classes.content}>
      {photoUrl ? (
        <Image className={classes.photo} src={photoUrl} alt={name} />
      ) : null}
      <h1 className={classes.name}>
        <div className={classes.caption}>Religion, politics, and ideas of</div>
        {name}
      </h1>
      {labels && labels.length > 0 ? (
        <ul aria-label="Labels" className={classes.labels}>
          {labels.map(({ id, text }) => (
            <li className={classes.listItem} key={id}>
              <Label text={text} />
            </li>
          ))}
        </ul>
      ) : null}
      {summary && (
        <div className={classes.about}>
          {summary
            .split('\n')
            .map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </div>
      )}
    </div>
  </div>
);
