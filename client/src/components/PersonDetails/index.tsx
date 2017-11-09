import * as React from 'react';
import { Label } from 'components/Label';
import { Image } from 'components/Image';
import './styles.scss';

type PersonDetailsProps = {
  summary: string | null;
  name: string;
  photoUrl: string;
  labels: Array<{ text: string; id: string }>;
};

const PersonDetails = ({
  summary,
  name,
  photoUrl,
  labels,
}: PersonDetailsProps) => (
  <div className="person-details">
    <Image className="person-details-avatar" src={photoUrl} alt={name} />
    <div className="person-details-caption">
      Religion, politics, and ideas of
    </div>
    <div className="person-details-name">{name}</div>
    <div className="person-details-labels">
      {labels.map(({ id, text }) => <Label key={id} text={text} />)}
    </div>
    {summary && (
      <div className="person-details-about">
        {summary.split('\n').map((p, i) => <p key={i}>{p}</p>)}
      </div>
    )}
  </div>
);

export default PersonDetails;
