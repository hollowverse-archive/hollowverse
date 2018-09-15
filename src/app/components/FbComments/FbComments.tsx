import React from 'react';
import cc from 'classcat';

import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import CircularProgress from '@material-ui/core/CircularProgress';

import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { AsyncComponent } from 'hocs/AsyncComponent/AsyncComponent';

import { importGlobalScript } from 'helpers/importGlobalScript';
import { isPendingResult, isErrorResult } from 'helpers/asyncResults';
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';

import warningIcon from 'icons/warning.svg';

const warningIconComponent = <SvgIcon {...warningIcon} />;

const loadingComponent = (
  <MessageWithIcon
    title="Loading Facebook comments..."
    icon={<CircularProgress size={50} />}
  />
);

const styles = ({ palette }: Theme) =>
  createStyles({
    root: {
      '& [fb-xfbml-state="rendered"]':
        palette.type === 'dark'
          ? {
              filter: 'grayscale(100%) invert(1)',
            }
          : {},
    },
  });

type Props = React.HTMLAttributes<HTMLDivElement> & {
  url: string;
  numPosts?: number;
} & WithStyles<ReturnType<typeof styles>>;

const OBSERVED_FB_ATTR_NAME = 'fb-xfbml-state';

/** Facebook Comments Plugin */
export const FbComments = withStyles(styles)(
  class extends React.PureComponent<Props> {
    commentsNode: HTMLDivElement | null = null;

    commentsParentNode: HTMLDivElement | null = null;

    commentsObserver: MutationObserver | null = null;

    setCommentsParentNode = (node: HTMLDivElement | null) => {
      this.commentsParentNode = node;
    };

    setCommentsNode = (node: HTMLDivElement | null) => {
      this.commentsNode = node;
    };

    load = async () => {
      if (!('FB' in global)) {
        await importGlobalScript(
          'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11',
        );
      }

      const observingComplete = this.observeCommentsRendered();

      await new Promise((resolve, reject) => {
        if (FB && this.commentsParentNode) {
          FB.XFBML.parse(this.commentsParentNode, resolve);
        } else {
          reject();
        }
      });

      if (this.commentsObserver) {
        this.commentsObserver.takeRecords();
      }

      await observingComplete;
    };

    observeCommentsRendered = async () =>
      new Promise(resolve => {
        if (!('MutationObserver' in window)) {
          resolve();
        } else if (this.commentsNode) {
          this.commentsObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
              const attr = (mutation.target as Element).attributes.getNamedItem(
                OBSERVED_FB_ATTR_NAME,
              );

              if (
                mutation.attributeName === OBSERVED_FB_ATTR_NAME &&
                attr !== null &&
                attr.value === 'rendered'
              ) {
                resolve();
                if (this.commentsObserver) {
                  this.commentsObserver.disconnect();
                }
                break;
              }
            }
          });

          this.commentsObserver.observe(this.commentsNode, {
            childList: false,
            attributeOldValue: false,
            attributeFilter: [OBSERVED_FB_ATTR_NAME],
          });
        }
      });

    componentWillUnmount() {
      if (this.commentsObserver !== null) {
        this.commentsObserver.disconnect();
      }
    }

    render() {
      const { url, className, classes, numPosts = 5, ...rest } = this.props;

      return (
        <div className={cc([className, classes.root])} {...rest}>
          <AsyncComponent load={this.load}>
            {({ result, retry }) => {
              if (isErrorResult(result) || result.hasTimedOut) {
                return (
                  <MessageWithIcon
                    title={
                      result.hasTimedOut
                        ? 'Comments are taking too long to load'
                        : 'Error loading comments'
                    }
                    icon={warningIconComponent}
                    button={
                      <Button size="small" onClick={retry}>
                        <RefreshIcon />
                        Retry
                      </Button>
                    }
                  />
                );
              }

              const isInProgress = isPendingResult(result);

              return (
                <div>
                  {isInProgress ? loadingComponent : null}
                  <noscript>
                    <MessageWithIcon
                      title="Unable to load comments"
                      description="Enable JavaScript in your browser settings and reload this page to see comments"
                      icon={warningIconComponent}
                    />
                  </noscript>
                  <div
                    style={{ visibility: isInProgress ? 'hidden' : 'visible' }}
                    ref={this.setCommentsParentNode}
                  >
                    <div
                      // A unique `key` is required to prevent
                      // React from re-using the DOM Node for
                      // other pages, which confuses Facebook SDK
                      // and causes the component to be stuck
                      // at "Loading..."
                      key={url}
                      className="fb-comments"
                      data-href={url}
                      data-width="100%"
                      data-numposts={numPosts}
                      ref={this.setCommentsNode}
                    />
                  </div>
                </div>
              );
            }}
          </AsyncComponent>
        </div>
      );
    }
  },
);
