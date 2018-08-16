import React from 'react';
import {
  LazyImage,
  Props as LazyImageProps,
} from 'components/LazyImage/LazyImage';
import { Image, Props as ImageProps } from 'components/Image/Image';
import cc from 'classcat';

import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';

import photoPlaceholderUrl from '!!file-loader!svgo-loader!assets/personPlaceholder.svg';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
    },
  });

type Props = WithStyles<ReturnType<typeof styles>> &
  (
    | (ImageProps & { isLazy?: false })
    | (LazyImageProps & {
        isLazy: true;
      }));

export const PersonPhoto = withStyles(styles)<Props>(
  class extends React.PureComponent<Props> {
    render() {
      const {
        isLazy,
        className,
        classes,
        role,
        alt,
        src,
        ...imageProps
      } = this.props;

      const overrides = {
        className: cc([classes.root, className]),
        src: src || photoPlaceholderUrl,
        role: !src ? 'presentation' : role,
        alt: !src ? undefined : alt,
      };

      const Component = isLazy ? LazyImage : Image;

      return <Component {...imageProps} {...overrides} />;
    }
  },
);
