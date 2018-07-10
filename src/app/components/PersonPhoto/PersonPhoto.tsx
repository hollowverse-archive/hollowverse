import React from 'react';
import {
  LazyImage,
  Props as LazyImageProps,
} from 'components/LazyImage/LazyImage';
import { Image, Props as ImageProps } from 'components/Image/Image';
import cc from 'classcat';

import classes from './PersonPhoto.module.scss';

import photoPlaceholderUrl from '!!file-loader!svgo-loader!assets/personPlaceholder.svg';

type Props =
  | (ImageProps & { isLazy?: false })
  | (LazyImageProps & {
      isLazy: true;
    });

export class PersonPhoto extends React.PureComponent<Props> {
  render() {
    const { isLazy, className, role, alt, src, ...imageProps } = this.props;

    const overrides = {
      className: cc([classes.root, className, { [classes.noSrc]: !src }]),
      src: src || photoPlaceholderUrl,
      role: !src ? 'presentation' : role,
      alt: !src ? undefined : alt,
    };

    const Component = isLazy ? LazyImage : Image;

    return <Component {...imageProps} {...overrides} />;
  }
}
