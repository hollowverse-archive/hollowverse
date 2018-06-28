import React from 'react';
import { Menu, closeMenu } from 'react-aria-menubutton';
import cc from 'classcat';
import CSSTransition from 'react-transition-group/CSSTransition';
import { MenuItemWithLink, MenuItemWithButton } from './MenuItem';

import { PersonPhoto } from 'components/PersonPhoto/PersonPhoto';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import closeIcon from 'icons/close.svg';
import facebookIcon from 'icons/facebook.svg';

import classes from './AppMenu.module.scss';

const Separator = <div aria-hidden className={classes.separator} />;

type Props = {
  user: any;
  getMenuStyle?(): React.CSSProperties;
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

  closeMenu = () => {
    closeMenu('app-menu-wrapper');
  };

  render() {
    const { user, getMenuStyle = () => undefined } = this.props;

    return (
      <nav className={classes.root} aria-label="Hollowverse">
        <Menu className={classes.menu}>
          {({ isOpen }: { isOpen: boolean }) => (
            <CSSTransition
              classNames="menu"
              timeout={100}
              in={isOpen}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <div
                  className={classes.overlay}
                  onClick={this.closeMenu}
                  aria-hidden
                  role="button"
                />
                <div
                  className={cc(['body', classes.body])}
                  style={getMenuStyle()}
                >
                  {this.renderUser()}
                  <MenuItemWithLink to="/">Home</MenuItemWithLink>
                  <MenuItemWithLink to="/contact">Contact</MenuItemWithLink>
                  {Separator}
                  <MenuItemWithButton
                    className={user ? undefined : classes.facebook}
                    type="button"
                    onClick={this.handleLogin}
                    icon={
                      user ? (
                        undefined
                      ) : (
                        <SvgIcon
                          className={classes.facebookIcon}
                          size={24}
                          {...facebookIcon}
                        />
                      )
                    }
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
              </div>
            </CSSTransition>
          )}
        </Menu>
      </nav>
    );
  }
}
