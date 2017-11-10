/**
 * FbComments Component
 */
import * as React from 'react';
import { importGlobalScript } from 'helpers/importGlobalScript';
import { MessageWithIcon } from 'components/MessageWithIcon';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { SvgIcon } from 'components/SvgIcon';
import { delay } from 'helpers/time';

import warningIcon from 'icons/warning.svg';

const loadingComponent = (
  <MessageWithIcon
    caption="Loading Facebook comments..."
    icon={<LoadingSpinner size={50} />}
  />
);

type P = {
  url: string;
  numPosts?: number;

  /**
   * Time in milliseconds after which loading is considered to have failed
   * Defaults to `6000`. If `null`, loading never times out.
   */
  timeout?: number | null;
};

type S = {
  isLoading: boolean;
  hasError: boolean;
  timedOut: boolean;
};

const OBSERVED_FB_ATTR_NAME = 'fb-xfbml-state';

/** Facebook Comments Plugin */
export class FbComments extends React.PureComponent<P, S> {
  static defaultProps: Partial<P> = {
    timeout: 20000,
  };

  state: S = {
    isLoading: true,
    hasError: false,
    timedOut: false,
  };

  target: HTMLDivElement | null;
  commentsObserver: MutationObserver | null = null;

  setTarget = (node: HTMLDivElement | null) => (this.target = node);

  observeCommentsRendered = async () =>
    new Promise(resolve => {
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

  tryLoading = () => {
    this.setState({ isLoading: true, hasError: false, timedOut: false }, () => {
      const promises = [
        importGlobalScript(
          'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10',
        )
          .then(this.observeCommentsRendered)
          .then(() => {
            this.setState({ isLoading: false });
          }),
      ];

      const { timeout } = this.props;
      if (timeout !== null) {
        promises.push(
          delay(timeout).then(() => {
            this.setState(state => {
              if (state.isLoading) {
                return {
                  isLoading: false,
                  hasError: true,
                  timedOut: true,
                };
              }

              return undefined;
            });
          }),
        );
      }

      Promise.race(promises).catch(() => {
        this.setState({ isLoading: false, hasError: true });
      });
    });
  };

  componentDidMount() {
    this.tryLoading();
  }

  componentWillMount() {
    if (this.commentsObserver !== null) {
      this.commentsObserver.disconnect();
    }
  }

  render() {
    const { url, numPosts = 5 } = this.props;
    const { hasError, isLoading, timedOut } = this.state;

    if (hasError || timedOut) {
      return (
        <MessageWithIcon
          caption="Error loading Facebook comments"
          icon={<SvgIcon {...warningIcon} size={50} />}
          actionText="Retry"
          onActionClick={this.tryLoading}
        />
      );
    }

    return (
      <div>
        {isLoading ? loadingComponent : null}
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
  }
}
