import React from 'react';
import { AsyncComponent } from 'hocs/AsyncComponent/AsyncComponent';
import cc from 'classcat';
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import warningIcon from '!!file-loader!icons/warning.svg';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-block',
      '&$hasError, &$isLoading': {
        backgroundSize: '50%',
        backgroundRepeat: 'no-repeat',
        backgroundColor: theme.palette.background.default,
        backgroundPosition: 'center',
      },
    },
    isLoading: {},
    hasError: {
      backgroundImage: `url("${warningIcon}")`,
    },
  });

export type Props = WithStyles<ReturnType<typeof styles>> &
  Partial<React.ImgHTMLAttributes<HTMLImageElement>> & {
    loadingComponent?: JSX.Element | null;
    errorComponent?: JSX.Element | null;
  };

import {
  isSuccessResult,
  isErrorResult,
  isPendingResult,
} from 'helpers/asyncResults';

/**
 * This component wraps a regular `<img>` tag and optionally shows
 * a fallback component while the image is loading or if it has failed to load
 */
export const Image = withStyles(styles)<Props>(
  class extends React.PureComponent<Props> {
    load = async () =>
      new Promise(async (resolve, reject) => {
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
        } else {
          reject(new Error());
        }
      });

    render() {
      return (
        <AsyncComponent delay={200} load={this.load}>
          {({ result }) => {
            const {
              className,
              classes,
              loadingComponent,
              errorComponent,
              ...rest
            } = this.props;

            if (isSuccessResult(result)) {
              return <img className={className} {...rest} />;
            }

            const hasError = isErrorResult(result);
            const isInProgress = isPendingResult(result);

            if (errorComponent !== undefined && hasError) {
              return errorComponent;
            } else if (loadingComponent !== undefined && isInProgress) {
              return loadingComponent;
            }

            const { style } = rest;

            return (
              <span
                style={style}
                className={cc([
                  className,
                  classes.root,
                  {
                    [classes.isLoading]: isInProgress,
                    [classes.hasError]: hasError,
                  },
                ])}
              />
            );
          }}
        </AsyncComponent>
      );
    }
  },
);
