import React from 'react';
import cc from 'classcat';

import classes from './NavBarButton.module.scss';
import {
  Button,
  ButtonProps,
  LinkButton,
  LinkButtonProps,
} from 'components/Button/Button';

export const NavBarButton = ({ className, ...rest }: ButtonProps) => (
  <Button className={cc([className, classes.root])} {...rest} />
);

export const NavBarLink = ({ className, ...rest }: LinkButtonProps) => (
  <LinkButton className={cc([className, classes.root])} {...rest} />
);
