import * as React from 'react';
import cc from 'classcat';
import * as classes from './Button.module.scss';
import {
  LoggableLink,
  LoggableLinkProps,
} from 'components/LoggableLink/LoggableLink';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ className, ...rest }: ButtonProps) => (
  <button className={cc([classes.root, className])} {...rest} />
);

export type LinkButtonProps = LoggableLinkProps;

export const LinkButton = ({ className, ...rest }: LinkButtonProps) => (
  <LoggableLink className={cc([classes.root, className])} {...rest} />
);
