import React from 'react';
import MenuItem, { MenuItemProps as Props } from '@material-ui/core/MenuItem';
import { Link, LinkProps } from 'react-router-dom';

// Strongly-typed convenience wrappers for `MenuItemWithChild`
export const MenuItemWithLink = (props: Props & LinkProps) => (
  <MenuItem component={Link as any} {...props} />
);
