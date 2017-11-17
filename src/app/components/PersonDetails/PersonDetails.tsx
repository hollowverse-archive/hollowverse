import * as React from 'react';
import { Label } from 'components/Label/Label';
import styles from './PersonDetails.module.scss';

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
  <div className={styles['person-details']}>
    <img
      className={styles['person-details-avatar']}
      src={photoUrl}
      alt={name}
    />
    <div className={styles['person-details-caption']}>
      Religion, politics, and ideas of
    </div>
    <div className={styles['person-details-name']}>{name}</div>
    <div className={styles['person-details-labels']}>
      {labels.map(({ id, text }) => <Label key={id} text={text} />)}
    </div>
    {summary && (
      <div className={styles['person-details-about']}>
        {summary.split('\n').map((p, i) => <p key={i}>{p}</p>)}
      </div>
    )}
  </div>
);
