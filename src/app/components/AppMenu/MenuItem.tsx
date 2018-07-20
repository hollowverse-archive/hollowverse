import React from 'react';
import MenuItem, { MenuItemProps as Props } from '@material-ui/core/MenuItem';
import { Link, LinkProps } from 'react-router-dom';

// tslint:disable-next-line function-name
export function MenuItemWithChild<FactoryProps extends { className?: string }>(
  props: Props & FactoryProps & { factory: string | React.ComponentType<any> },
) {
  const { factory: Factory } = props;

  return <MenuItem component={Factory} {...props} />;
}

// Strongly-typed convenience wrappers for `MenuItemWithChild`
export const MenuItemWithLink = (props: Props & LinkProps) => (
  <MenuItem component={Link as any} {...props} />
);
