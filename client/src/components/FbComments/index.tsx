/**
 * FbComments Component
 */
import * as React from 'react';
import { importGlobalScript } from 'helpers/importGlobalScript';
import { MessageWithIcon } from 'components/MessageWithIcon';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { SvgIcon } from 'components/SvgIcon';

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
};

type S = {
  isLoading: boolean;
  hasError: boolean;
};

const attrName = 'fb-xfbml-state';

/** Facebook Comments Plugin */
export class FbComments extends React.Component<P, S> {
  state: S = {
    isLoading: true,
    hasError: false,
  };

  target: HTMLDivElement | null;
  mo: MutationObserver | null = null;

  setTarget = (node: HTMLDivElement | null) => (this.target = node);

  observeCommentsRendered = () => {
    if (MutationObserver === undefined) {
      this.setState({ isLoading: false, hasError: false });
    } else if (this.target) {
      this.mo = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (
            mutation.attributeName === attrName &&
            mutation.target.attributes.getNamedItem(attrName).value ===
              'rendered'
          ) {
            this.setState({ isLoading: false, hasError: false });
          }
        });
      });

      this.mo.observe(this.target, {
        childList: false,
        attributeOldValue: false,
        attributeFilter: [attrName],
      });
    }
  };

  async componentDidMount() {
    try {
      await importGlobalScript(
        'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10',
      );
      this.observeCommentsRendered();
    } catch (e) {
      this.setState({ isLoading: false, hasError: true });
    }
  }

  componentWillMount() {
    if (this.mo !== null) {
      this.mo.disconnect();
    }
  }

  render() {
    const { url, numPosts = 5 } = this.props;
    const { hasError, isLoading } = this.state;

    if (hasError) {
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
