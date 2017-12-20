import * as React from 'react';
import cc from 'classcat';

import * as classes from './NavBarButton.module.scss';
import { Link, LinkProps } from 'react-router-dom';

export const NavBarButton = ({
  className,
  ...rest,
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cc([className, classes.root])} {...rest} />
);

export const NavBarLink = ({ className, ...rest }: LinkProps) => (
  <Link className={cc([className, classes.root])} {...rest} />
);
