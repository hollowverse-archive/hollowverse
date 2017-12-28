import * as React from 'react';
import { connect } from 'react-redux';
import {
  setStatusCode,
  setRedirectionUrl,
} from 'store/features/status/actions';

type CommonProps = {
  children?: undefined;
};

type DispatchProps = {
  setStatusCode: typeof setStatusCode;
  setRedirectionUrl: typeof setRedirectionUrl;
};

type RedirectionProps = {
  code: 301 | 302;
  redirectTo: string;
};

type NonRedirectionProps = {
  code: 200 | 404 | 500;
};

type OwnProps = CommonProps & (RedirectionProps | NonRedirectionProps);

type Props = DispatchProps & OwnProps;

function isRedirection(
  props: Props,
): props is CommonProps & DispatchProps & RedirectionProps {
  return (
    props.code === 301 ||
    (props.code === 302 &&
      typeof (props as RedirectionProps).redirectTo === 'string')
  );
}

export const Status = connect<{}, DispatchProps, OwnProps>(undefined, {
  setStatusCode,
  setRedirectionUrl,
})(
  class extends React.PureComponent<Props> {
    componentWillMount() {
      this.props.setStatusCode(this.props.code);

      if (isRedirection(this.props)) {
        this.props.setRedirectionUrl(this.props.redirectTo);
      }
    }

    render() {
      return null;
    }
  },
);
