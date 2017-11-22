import * as React from 'react';
import cc from 'classcat';

import * as classes from './Label.module.scss';

type Props = {
  text: string;
  size?: 'small' | 'normal';
};

export const Label = ({ text, size = 'normal' }: Props) => (
  <div
    className={cc({ [classes.label]: true, [classes.small]: size === 'small' })}
  >
    {text}
  </div>
);
