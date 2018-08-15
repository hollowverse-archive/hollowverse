import React from 'react';
import cc from 'classcat';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      '--default-fill': theme.palette.text.secondary,
    },
  });

type Props = React.HTMLAttributes<SVGElement> &
  SpriteSymbol & {
    /** Height of icon in pixels */
    size?: number | string;
    color?: string;
  } & WithStyles<ReturnType<typeof styles>>;

export const SvgIcon = withStyles(styles)(
  ({
    id: _, // Remove `id` from `rest` so it does not get assigned to this SVG element
    toString: __,
    url,
    viewBox,
    className,
    classes,
    color,
    size = 32,
    ...rest
  }: Props) => (
    <svg
      {...rest}
      height={size}
      role="presentation"
      viewBox={viewBox}
      className={cc([className, classes.root])}
      style={{ '--fill': color } as any}
    >
      <use xlinkHref={url} />
    </svg>
  ),
);
