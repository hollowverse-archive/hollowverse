import React, { Children } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import Tabs, { TabsProps } from '@material-ui/core/Tabs';

type Props = RouteComponentProps<any> & TabsProps;

type State = {
  value: TabsProps['value'];
};

export const LocationAwareTabs = withRouter(
  class extends React.Component<Props, State> {
    state: State = {
      value: this.props.value,
    };

    handleChange: TabsProps['onChange'] = (_event, value) => {
      this.setState({
        value,
      });
    };

    render() {
      const { history, staticContext, match, children, ...rest } = this.props;
      const { value } = this.state;

      return (
        <Tabs {...rest} value={value} onChange={this.handleChange}>
          {Children.map(children, child => {
            return (
              // @ts-ignore
              <Tab {...child.props} component={Link} to={child.props.value} />
            );
          })}
        </Tabs>
      );
    }
  },
);
