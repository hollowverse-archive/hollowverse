import * as React from 'react';
import { cn } from '../utils/utils';

interface IProps {
  name: string;
  size?: 16;
}

export class Icon extends React.Component<
  IProps & React.HTMLAttributes<HTMLElement>,
  undefined
> {
  static defaultProps: Partial<IProps> = {
    size: 16,
  };

  render() {
    const { name, size, className, style, ...rest } = this.props;

    return (
      <i
        className={cn(`fa fa-${name}`, className)}
        style={{ ...style, fontSize: size }}
        {...rest}
      />
    );
  }
}
