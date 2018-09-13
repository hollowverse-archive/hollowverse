import React, { Children } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import Tabs, { TabsProps } from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

type Props = RouteComponentProps<any> & TabsProps;

type State = {
  value: TabsProps['value'];
};

export const LocationAwareTabs = withRouter(
  class extends React.PureComponent<Props, State> {
    state: State = {
      value: this.props.history.createHref(this.props.location),
    };

    handleChange: TabsProps['onChange'] = (_event, value) => {
      this.setState({
        value,
      });
    };

    render() {
      const {
        history,
        location,
        staticContext,
        match,
        children,
        ...rest
      } = this.props;
      const { value } = this.state;

      return (
        <Tabs {...rest} value={value} onChange={this.handleChange}>
          {Children.map(children, child => {
            if (!(typeof child === 'object' && 'props' in child)) {
              return child;
            }

            return (
              <Tab {...child.props} component={Link} to={child.props.value} />
            );
          })}
        </Tabs>
      );
    }
  },
);
