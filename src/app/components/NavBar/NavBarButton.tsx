import React from 'react';
import cc from 'classcat';

import classes from './NavBarButton.module.scss';
import {
  Button,
  ButtonProps,
  LinkButton,
  LinkButtonProps,
} from 'components/Button/Button';

export const NavBarButton = ({
  className,
  Factory = Button,
  ...rest
}: ButtonProps & { Factory?: any }) => (
  <Factory className={cc([className, classes.root])} {...rest} />
);

const { root } = classes;

export { root as navButtonClass };

export const NavBarLink = ({ className, ...rest }: LinkButtonProps) => (
  <LinkButton className={cc([className, classes.root])} {...rest} />
);
