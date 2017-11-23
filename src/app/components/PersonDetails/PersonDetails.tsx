import * as React from 'react';
import { Label } from 'components/Label/Label';
import * as classes from './PersonDetails.module.scss';

type PersonDetailsProps = {
  summary: string | null;
  name: string;
  photoUrl: string;
  labels: Array<{ text: string; id: string }>;
};

export const PersonDetails = ({
  summary,
  name,
  photoUrl,
  labels,
}: PersonDetailsProps) => (
  <div className={classes.personDetails}>
    <img className={classes.personDetailsAvatar} src={photoUrl} alt={name} />
    <div className={classes.personDetailsCaption}>
      Religion, politics, and ideas of
    </div>
    <h1 className={classes.personDetailsName}>{name}</h1>
    <div className={classes.personDetailsLabels}>
      {labels.map(({ id, text }) => <Label key={id} text={text} />)}
    </div>
    {summary && (
      <div className={classes.personDetailsAbout}>
        {summary.split('\n').map((p, i) => <p key={i}>{p}</p>)}
      </div>
    )}
  </div>
);
