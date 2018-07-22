import React from 'react';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import { RouteComponentProps, withRouter } from 'react-router';

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
