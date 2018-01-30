import * as React from 'react';

export class ScrollToOnMount extends React.PureComponent {
  node: HTMLSpanElement | null;

  setRef = (node: HTMLSpanElement) => {
    this.node = node;
  };

  componentDidMount() {
    if (this.node !== null) {
      this.node.scrollIntoView(true);
    }
  }

  render() {
    return <span ref={this.setRef} />;
  }
}
