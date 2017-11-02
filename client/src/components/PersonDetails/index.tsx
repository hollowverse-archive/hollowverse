import * as React from 'react';
import Label from '../Label';
import './styles.scss';

type PersonDetailsProps = {
  summary?: string;
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
    <div
      className="person-details-avatar"
      style={{ backgroundImage: `url(${photoUrl})` }}
    />
    <div className="person-details-caption">
      Religion, politics, and ideas of
    </div>
    <div className="person-details-name">{name}</div>
    <div className="person-details-labels">
      {labels.map(({ id, text }) => <Label key={id} text={text} />)}
    </div>
    <div className="person-details-about">{summary}</div>
  </div>
);

export default PersonDetails;
