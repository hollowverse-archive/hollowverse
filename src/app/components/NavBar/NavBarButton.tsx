import React from 'react';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';

import { Link, LinkProps } from 'react-router-dom';

export const NavBarButton = ({
  className,
  Factory = IconButton,
  ...rest
}: IconButtonProps & { Factory?: any }) => (
  <IconButton component={Factory} {...rest} />
);

export const NavBarLink = ({
  className,
  ...rest
}: IconButtonProps & LinkProps) => (
  <IconButton component={Link as any} {...rest} />
);
