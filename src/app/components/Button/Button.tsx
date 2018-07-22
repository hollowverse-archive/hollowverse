import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { Link, LinkProps } from 'react-router-dom';

export type LinkButtonProps = ButtonProps & LinkProps;

export const LinkButton = ({ className, ...rest }: LinkButtonProps) => (
  <Button component={Link as any} {...rest} />
);
