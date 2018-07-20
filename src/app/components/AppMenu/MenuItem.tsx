import React from 'react';
import MenuItem, { MenuItemProps as Props } from '@material-ui/core/MenuItem';
import { Link, LinkProps } from 'react-router-dom';

export const MenuItemWithLink = (props: Props & LinkProps) => (
  <MenuItem component={Link as any} {...props} />
);
