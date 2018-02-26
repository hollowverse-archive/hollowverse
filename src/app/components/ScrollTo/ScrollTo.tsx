import React from 'react';

type Props = {
  updateKey: string;
};

export class ScrollTo extends React.PureComponent<Props> {
  node: HTMLSpanElement | null = null;

  setRef = (node: HTMLSpanElement) => {
    this.node = node;
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.updateKey !== nextProps.updateKey && this.node !== null) {
      this.node.scrollIntoView(true);
    }
  }

  render() {
    return <span ref={this.setRef} />;
  }
}
