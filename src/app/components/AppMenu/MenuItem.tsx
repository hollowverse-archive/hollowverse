import React from 'react';
import cc from 'classcat';
import { MenuItem as AriaMenuItem } from 'react-aria-menubutton';

import classes from './MenuItem.module.scss';
import { Link, LinkProps } from 'react-router-dom';
import { Omit } from 'typings/typeHelpers';
import { omit } from 'lodash';

type Props = {
  className?: string;
  size?: 'small' | 'default';
  children?: React.ReactNode;
  icon?: React.ReactNode;
};

export const MenuItem = ({ children, className, size = 'default' }: Props) => (
  <AriaMenuItem
    className={cc([
      classes.root,
      className,
      { [classes.small]: size === 'small' },
    ])}
    role="none"
  >
    {children}
  </AriaMenuItem>
);

function MenuItemWithChild<ChildProps extends { className?: string }>(
  props: Props & ChildProps & { Child: string | React.ComponentType<any> },
) {
  const { size, className, children, icon, Child } = props;

  // Normally we would do { size, className, ...childProps } = props;
  // but TypeScript does not currently support spreading generic
  // types
  // See: https://github.com/Microsoft/TypeScript/issues/10727
  const childProps = omit(
    props,
    'size',
    'className',
    'children',
    'icon',
    'Child',
  ) as ChildProps;

  return (
    <MenuItem size={size} className={className}>
      <Child
        className={cc([classes.link, { [classes.small]: size === 'small' }])}
        {...childProps}
        role="menuitem"
      >
        {icon && <div className={classes.icon}>{icon}</div>}
        {children && <div>{children}</div>}
      </Child>
    </MenuItem>
  );
}

// Strongly-typed convenience wrappers for `MenuItemWithChild`
export const MenuItemWithLink = (props: Props & LinkProps) => (
  <MenuItemWithChild Child={Link} {...props} />
);

export const MenuItemWithButton = (
  props: Props & Omit<React.InputHTMLAttributes<HTMLButtonElement>, 'children'>,
) => <MenuItemWithChild Child="button" {...props} />;
