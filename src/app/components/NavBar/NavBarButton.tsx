import React from 'react';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';

import { Link, LinkProps } from 'react-router-dom';

export const NavBarLink = ({
  className,
  component = Link as any,
  ...rest
}: IconButtonProps & LinkProps) => (
  <IconButton component={component} {...rest} />
);
