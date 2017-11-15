/**
 * FbComments Component
 */
import * as React from 'react';
import { importGlobalScript } from 'helpers/importGlobalScript';
import { MessageWithIcon } from 'components/MessageWithIcon';
import { LoadingSpinner } from 'components/LoadingSpinner';
// import { SvgIcon } from 'components/SvgIcon';

// import warningIcon from 'icons/warning.svg';
import { AsyncComponent } from 'hocs/AsyncComponent/AsyncComponent';

const loadingComponent = (
  <MessageWithIcon
    caption="Loading Facebook comments..."
    icon={<LoadingSpinner size={50} />}
  />
);

type P = {
  url: string;
  numPosts?: number;
};

const OBSERVED_FB_ATTR_NAME = 'fb-xfbml-state';

/** Facebook Comments Plugin */
export class FbComments extends React.PureComponent<P> {
  target: HTMLDivElement | null;
  commentsObserver: MutationObserver | null = null;

  setTarget = (node: HTMLDivElement | null) => (this.target = node);

  load = async () => {
    return importGlobalScript(
      'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10',
    ).then(this.observeCommentsRendered);
  };

  observeCommentsRendered = async () => {
    return new Promise(resolve => {
      if (MutationObserver === undefined) {
        resolve();
      } else if (this.target) {
        this.commentsObserver = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            if (
              mutation.attributeName === OBSERVED_FB_ATTR_NAME &&
              mutation.target.attributes.getNamedItem(OBSERVED_FB_ATTR_NAME)
                .value === 'rendered'
            ) {
              resolve();
              if (this.commentsObserver) {
                this.commentsObserver.disconnect();
              }
            }
          });
        });

        this.commentsObserver.observe(this.target, {
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
    const { url, numPosts = 5 } = this.props;

    return (
      <AsyncComponent load={this.load}>
        {({ hasError, isLoading, timedOut, retry }) => {
          if (hasError || timedOut) {
            return (
              <MessageWithIcon
                caption="Error loading Facebook comments"
                actionText="Retry"
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
                />
              </noscript>
              <div
                style={{ visibility: isLoading ? 'hidden' : 'visible' }}
                className="fb-comments"
                data-href={url}
                data-width="100%"
                data-numposts={numPosts}
                ref={this.setTarget}
              />
            </div>
          );
        }}
      </AsyncComponent>
    );
  }
}
