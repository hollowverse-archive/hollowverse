import React from 'react';
/* eslint-disable-next-line no-restricted-imports */
import Menu, { MenuProps } from '@material-ui/core/Menu';
import { RouteComponentProps, withRouter } from 'react-router';

export { MenuProps };

/**
 * A wrapper around `material-ui`'s `Menu` component that automatically calls
 * the `onClose` handler on navigation changes.
 */
export const LocationAwareMenu = withRouter(
  class extends React.PureComponent<MenuProps & RouteComponentProps<any>> {
    componentDidMount() {
      this.props.history.listen(() => {
        if (!this.props.onClose) {
          return;
        }

        this.props.onClose({} as any);
      });
    }

    render() {
      const { history, staticContext, match, location, ...rest } = this.props;

      return <Menu {...rest} />;
    }
  },
);
