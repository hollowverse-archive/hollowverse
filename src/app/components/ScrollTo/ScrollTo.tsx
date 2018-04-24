import React from 'react';

type Props = {
  updateKey: string;
};

export class ScrollTo extends React.PureComponent<Props> {
  node: HTMLSpanElement | null = null;

  setRef = (node: HTMLSpanElement) => {
    this.node = node;
  };

  scroll = () => {
    if (this.node !== null && 'scrollIntoView' in this.node) {
      this.node.scrollIntoView(true);
    }
  };

  componentDidMount() {
    this.scroll();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.updateKey !== nextProps.updateKey) {
      this.scroll();
    }
  }

  render() {
    return <span ref={this.setRef} />;
  }
}
