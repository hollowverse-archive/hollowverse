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

/** Facebook Comments Plugin */
export class FbComments extends React.PureComponent<Props> {
  target: HTMLDivElement | null;

  setTarget = (node: HTMLDivElement | null) => (this.target = node);

  load = async () => {
    await importGlobalScript(
      'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11',
    );

    await new Promise(resolve => {
      if (FB && this.target) {
        FB.XFBML.parse(this.target, resolve);
      } else {
        resolve();
      }
    });
  };

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
                <div ref={this.setTarget}>
                  <div
                    style={{ visibility: isLoading ? 'hidden' : 'visible' }}
                    className="fb-comments"
                    data-href={url}
                    data-width="100%"
                    data-numposts={numPosts}
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
