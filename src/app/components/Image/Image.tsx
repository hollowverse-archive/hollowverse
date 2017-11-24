import * as React from 'react';
import { AsyncComponent } from 'hocs/AsyncComponent/AsyncComponent';
import cc from 'classcat';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  loadingComponent?: JSX.Element | null;
  errorComponent?: JSX.Element | null;
};

import * as classes from './Image.module.scss';

/**
 * This component wraps a regular `<img>` tag and optionally shows
 * a fallback component while the image is loading or if it has failed to load
 */
export class Image extends React.PureComponent<Props> {
  load = async () => new Promise(async (resolve, reject) => {
    const img = document.createElement('img');
    img.onload = () => {
      resolve();
    };

    img.onerror = ({ error }) => {
      reject(error);
    };
  
    const { src } = this.props;
    if (src) {
      img.src = src;
    }
  });

  render() {
    return (
      <AsyncComponent load={this.load}>
        {({ isLoading, hasError }) => {
          const {
            className,
            loadingComponent,
            errorComponent,
            ...rest,
          } = this.props;

          const hasLoaded = !isLoading && !hasError;

          if (hasLoaded) {
            return <img className={className} {...rest} />;
          }

          if (errorComponent !== undefined && hasError) {
            return errorComponent;
          } else if (loadingComponent !== undefined && isLoading) {
            return loadingComponent;
          }

          const { style } = rest;
      
          return <div
            style={style}
            className={cc([
              className,
              classes.image,
              {
                [classes.isLoading]: isLoading,
                [classes.hasError]: hasError
              },
            ])}
          />;
        }}
      </AsyncComponent>
    );
  }
}