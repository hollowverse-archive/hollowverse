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

/**
 * Sets the server's response status code and optionally
 * the redirection URL in case of `301` or `301` codes.
 *
 * This component renders nothing, and should not have `children`.
 *
 * It is only used for its side effect on the Redux store
 * (which is then queried on the server side).
 */
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
