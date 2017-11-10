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

const errorComponent = (
  <MessageWithIcon
    caption="Error loading Facebook comments"
    icon={<SvgIcon {...warningIcon} size={50} />}
  />
);

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

const attrName = 'fb-xfbml-state';

/** Facebook Comments Plugin */
export class FbComments extends React.Component<P, S> {
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
              mutation.attributeName === attrName &&
              mutation.target.attributes.getNamedItem(attrName).value ===
                'rendered'
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
          attributeFilter: [attrName],
        });
      }
    });

  componentDidMount() {
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
          this.setState({ isLoading: false, hasError: true, timedOut: true });
        }),
      );
    }

    Promise.race(promises).catch(() => {
      this.setState({ isLoading: false, hasError: true });
    });
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
      return errorComponent;
    }

    return (
      <div>
        {isLoading ? loadingComponent : null}
        <div
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
