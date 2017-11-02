import * as React from 'react';
import './styles.scss';

const Label = (props: { text: string }) => (
  <div className="label">{props.text}</div>
);

export default Label;
