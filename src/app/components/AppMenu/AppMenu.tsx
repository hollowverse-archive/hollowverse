import React from 'react';
import { Menu } from 'react-aria-menubutton';
import { MenuItemWithLink, MenuItemWithButton } from './MenuItem';

import { PersonPhoto } from 'components/PersonPhoto/PersonPhoto';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import closeIcon from 'icons/close.svg';
import facebookIcon from 'icons/facebook.svg';

import classes from './AppMenu.module.scss';

const Separator = <div aria-hidden className={classes.separator} />;

type Props = {
  user: any;
};

export class AppMenu extends React.PureComponent<Props> {
  renderUser = () => {
    const { user } = this.props;

    if (!user) {
      return undefined;
    }

    return (
      <>
        <PersonPhoto className={classes.userAvatar} src={user.avatar} />
        <div className={classes.userName}>{user.name}</div>
      </>
    );
  };

  renderMenuLinks = () => null;

  handleLogin = () => null;
  handleLogout = () => null;

  render() {
    const { user } = this.props;

    return (
      <nav className={classes.root} aria-label="Hollowverse">
        <Menu id="app-menu" className={classes.menu}>
          <div className={classes.overlay} />
          <div className={classes.body}>
            {this.renderUser()}
            <MenuItemWithLink to="/">Home</MenuItemWithLink>
            <MenuItemWithLink to="/contact">Contact</MenuItemWithLink>
            {Separator}
            <MenuItemWithButton
              className={user ? undefined : classes.facebook}
              type="button"
              onClick={this.handleLogin}
              icon={user ? undefined : <SvgIcon size={24} {...facebookIcon} />}
            >
              {user ? 'Log out' : 'Log in with Facebook'}
            </MenuItemWithButton>
            <MenuItemWithButton
              className={classes.close}
              aria-label="Close"
              icon={<SvgIcon size={16} {...closeIcon} />}
            />
            {Separator}
            <MenuItemWithLink size="small" to="/privacy-policy">
              Privacy Policy
            </MenuItemWithLink>
            <div className={classes.footer}>
              <div className={classes.copy}>&copy; 2018 Hollowverse</div>
            </div>
          </div>
        </Menu>
      </nav>
    );
  }
}
