import * as React from 'react';
import cc from 'classcat';

import * as classes from './NavBarButton.module.scss';
import { Link, LinkProps } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';

export const NavBarButton = ({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cc([className, classes.root])} {...rest} />
);

export const NavBarLink = withRouter(
  class extends React.PureComponent<LinkProps & RouteComponentProps<any>> {
    handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      const { to } = this.props;
      const finalTo =
        typeof to === 'string' ? to : this.props.history.createHref(to);
      e.preventDefault();
      this.props.history.push(finalTo);
    };

    render() {
      const { className, ...rest } = this.props;

      return (
        <Link
          className={cc([className, classes.root])}
          {...rest}
          onClick={this.handleClick}
        />
      );
    }
  },
);
