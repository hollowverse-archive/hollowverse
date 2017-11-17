import * as React from 'react';

type SpriteSymbol = {
  id: string;
  viewBox: string;
  content: string;
  url: string;
};
type Props = SpriteSymbol & {
  /** Height of icon in pixels */
  size?: number;
};

export const SvgIcon = ({ viewBox, url, size = 24 }: Props) => (
  <svg viewBox={`${viewBox}`} height={size}>
    <use xlinkHref={url} />
  </svg>
);
