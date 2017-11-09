import * as React from 'react';
import './styles.scss';

export const Label = (props: { text: string }) => (
  <div className="label">{props.text}</div>
);
