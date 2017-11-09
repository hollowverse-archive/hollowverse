/**
 * FbComments Component
 */
import * as React from 'react';

type P = {
  url: string;
  numPosts?: number;
};

/** Facebook Comments Plugin */
class FbComments extends React.Component<P, {}> {
  render() {
    const { url, numPosts = 5 } = this.props;

    return (
      <div
        className="fb-comments"
        data-href={url}
        data-width="100%"
        data-numposts={numPosts}
      />
    );
  }
}

export default FbComments;
