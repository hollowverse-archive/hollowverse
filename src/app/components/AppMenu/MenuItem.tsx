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

  /**
   * If `false`, disables hover and focus styles on the menu item
   * @default true
   */
  isClickable?: boolean;
};

const MenuItem = ({ children, className, size = 'default' }: Props) => (
  <AriaMenuItem
    className={cc([
      classes.root,
      className,
      { [classes.small]: size === 'small' },
    ])}
    tag="li"
    // Override role="menuitem" set by react-aria-menubutton because
    // it causes Android TalkBalk to read the menu item and its children
    // each separately. We will instead set `role="menuitem"` on the child
    // below and make screen reader skip the parent entirely.
    role="none"
    // tslint:disable-next-line react-a11y-tabindex-no-positive
    tabIndex={undefined}
  >
    {children}
  </AriaMenuItem>
);

// tslint:disable-next-line function-name
export function MenuItemWithChild<FactoryProps extends { className?: string }>(
  props: Props & FactoryProps & { factory: string | React.ComponentType<any> },
) {
  const {
    size,
    className,
    children,
    icon,
    factory: Factory,
    isClickable = true,
  } = props;

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
    'factory',
    'isClickable',
  ) as FactoryProps;

  return (
    <MenuItem
      size={size}
      className={cc([className, { [classes.isClickable]: isClickable }])}
    >
      <Factory
        className={cc([classes.child, { [classes.small]: size === 'small' }])}
        {...childProps}
        role={isClickable ? 'menuitem' : 'presentation'}
        // Make this element accessible via keyboard and screen readers
        tabIndex={isClickable ? 0 : -1}
      >
        {icon && <div className={classes.icon}>{icon}</div>}
        {children && <div>{children}</div>}
      </Factory>
    </MenuItem>
  );
}

// Strongly-typed convenience wrappers for `MenuItemWithChild`
export const MenuItemWithLink = (props: Props & LinkProps) => (
  <MenuItemWithChild factory={Link} {...props} />
);

export const MenuItemWithButton = (
  props: Props & Omit<React.InputHTMLAttributes<HTMLButtonElement>, 'children'>,
) => <MenuItemWithChild factory="button" {...props} />;
