import React from 'react';
import { importGlobalScript } from 'helpers/importGlobalScript';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { AsyncComponent } from 'hocs/AsyncComponent/AsyncComponent';

import warningIcon from 'icons/warning.svg';
import { Button } from 'components/Button/Button';

const warningIconComponent = <SvgIcon {...warningIcon} />;

const loadingComponent = (
  <MessageWithIcon
    title="Loading Facebook comments..."
    icon={<LoadingSpinner size={50} />}
  />
);

type Props = React.HTMLAttributes<HTMLDivElement> & {
  url: string;
  numPosts?: number;
};

const OBSERVED_FB_ATTR_NAME = 'fb-xfbml-state';

/** Facebook Comments Plugin */
export class FbComments extends React.PureComponent<Props> {
  commentsNode: HTMLDivElement | null = null;
  commentsParentNode: HTMLDivElement | null = null;
  commentsObserver: MutationObserver | null = null;

  setCommentsParentNode = (node: HTMLDivElement | null) =>
    (this.commentsParentNode = node);

  setCommentsNode = (node: HTMLDivElement | null) => (this.commentsNode = node);

  load = async () => {
    await importGlobalScript(
      'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11',
    );

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

  observeCommentsRendered = async () => {
    return new Promise(resolve => {
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
  };

  componentWillUnmount() {
    if (this.commentsObserver !== null) {
      this.commentsObserver.disconnect();
    }
  }

  render() {
    const { url, numPosts = 5, ...rest } = this.props;

    return (
      <div {...rest}>
        <AsyncComponent load={this.load}>
          {({ result: { hasError, isInProgress, hasTimedOut }, retry }) => {
            if (hasError || hasTimedOut) {
              return (
                <MessageWithIcon
                  title={
                    hasTimedOut
                      ? 'Comments are taking too long to load'
                      : 'Error loading comments'
                  }
                  icon={warningIconComponent}
                  button={<Button onClick={retry}>Retry</Button>}
                />
              );
            }

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
}
