import React from 'react';
import MenuItem, {
  MenuItemProps as Props,
  MenuItemProps,
} from '@material-ui/core/MenuItem';
import { Link, LinkProps } from 'react-router-dom';

export const MenuItemWithLink = (props: Props & LinkProps) => (
  <MenuItem component={Link as any} {...props} />
);

/** A disabled menu item that maintains an active item's appearance */
export const InertMenuItem = ({ style, ...rest }: MenuItemProps) => (
  <MenuItem disabled style={{ ...style, opacity: 'inherit' }} {...rest} />
);
