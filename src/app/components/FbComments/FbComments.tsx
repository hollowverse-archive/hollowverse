import * as React from 'react';
import { importGlobalScript } from 'helpers/importGlobalScript';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { AsyncComponent } from 'hocs/AsyncComponent/AsyncComponent';

import warningIcon from 'icons/warning.svg';

const warningIconComponent = <SvgIcon {...warningIcon} />;

const loadingComponent = (
  <MessageWithIcon
    caption="Loading Facebook comments..."
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
  commentsNode: HTMLDivElement | null;
  commentsParentNode: HTMLDivElement | null;

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

    await observingComplete;
  };

  observeCommentsRendered = async () => {
    return new Promise(resolve => {
      if (!('MutationObserver' in window)) {
        resolve();
      } else if (this.commentsNode) {
        this.commentsObserver = new MutationObserver(mutations => {
          for (const mutation of mutations) {
            if (
              mutation.attributeName === OBSERVED_FB_ATTR_NAME &&
              mutation.target.attributes.getNamedItem(OBSERVED_FB_ATTR_NAME)
                .value === 'rendered'
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

        this.commentsObserver.takeRecords();
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
          {({ hasError, isLoading, timedOut, retry }) => {
            if (hasError || timedOut) {
              return (
                <MessageWithIcon
                  caption="Error loading comments"
                  actionText="Retry"
                  icon={warningIconComponent}
                  onActionClick={retry}
                />
              );
            }

            return (
              <div>
                {isLoading ? loadingComponent : null}
                <noscript>
                  <MessageWithIcon
                    caption="Unable to load comments"
                    description="Enable JavaScript in your browser settings and reload this page to see comments"
                    icon={warningIconComponent}
                  />
                </noscript>
                <div
                  style={{ visibility: isLoading ? 'hidden' : 'visible' }}
                  ref={this.setCommentsParentNode}
                >
                  <div
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
