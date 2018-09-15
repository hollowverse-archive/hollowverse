import React, { Children } from 'react';
import { Link } from 'react-router-dom';
import Tabs, { TabsProps } from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { createPath, LocationDescriptorObject } from 'history';

type Props = { location: LocationDescriptorObject } & Pick<
  TabsProps,
  'children' | 'indicatorColor' | 'centered'
>;

export const LocationAwareTabs = class extends React.Component<Props> {
  render() {
    const { location, children, ...rest } = this.props;

    return (
      <Tabs {...rest} value={createPath(location)}>
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
};
