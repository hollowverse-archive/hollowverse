/**
 * FbComments Component
 */
import * as React from 'react';

type P = {
  url: string;
  numPosts?: number;
};

class FbComments extends React.Component<P, {}> {
  render() {
    const { url, numPosts = 5 } = this.props;

    return (
      <div>
        <div
          className="fb-comments"
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          data-href={url}
          data-numposts={numPosts}
        />
      </div>
    );
  }
}

export default FbComments;
