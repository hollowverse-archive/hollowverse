import * as React from 'react';
import { connect } from 'react-redux';
import { setStatusCode } from 'store/features/status/actions';

type Props = {
  children?: any;
  code: number;
  setStatusCode: typeof setStatusCode;
};

export const Status = connect(undefined, {
  setStatusCode,
})(
  class extends React.PureComponent<Props> {
    componentWillMount() {
      this.props.setStatusCode(this.props.code);
    }

    render() {
      return this.props.children;
    }
  },
);
