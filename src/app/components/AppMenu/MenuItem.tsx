import React from 'react';
import cc from 'classcat';
import MenuItem, { MenuItemProps as Props } from '@material-ui/core/MenuItem';
import { Link, LinkProps } from 'react-router-dom';

import classes from './MenuItem.module.scss';

export const MenuItemWithLink = (props: Props & LinkProps) => (
  <MenuItem component={Link as any} {...props} />
);

/** A disabled menu item that maintains an active item's appearance */
export const InertMenuItem = ({ className, ...rest }: any) => (
  <MenuItem disabled className={cc([className, classes.inert])} {...rest} />
);
