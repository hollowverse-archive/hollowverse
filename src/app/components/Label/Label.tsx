import * as React from 'react';
import './Label.scss';

export const Label = (props: { text: string }) => (
  <div className="label">{props.text}</div>
);
