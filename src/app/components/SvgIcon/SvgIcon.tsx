import * as React from 'react';

type SpriteSymbol = {
  id?: string;
  viewBox?: string;
  content?: string;
  url: string;
};
type Props = SpriteSymbol & {
  /** Height of icon in pixels */
  size?: number;
};

export const SvgIcon = ({ url, size = 32 }: Props) => (
  <img src={url} height={size} role="presentation" alt={undefined} />
);
