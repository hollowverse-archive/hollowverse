import React from 'react';
import { Menu, closeMenu } from 'react-aria-menubutton';
import CSSTransition, {
  CSSTransitionClassNames,
} from 'react-transition-group/CSSTransition';
import { MenuItemWithLink, MenuItemWithButton } from './MenuItem';

import { PersonPhoto } from 'components/PersonPhoto/PersonPhoto';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import closeIcon from 'icons/close.svg';
import facebookIcon from 'icons/facebook.svg';

import classes from './AppMenu.module.scss';

const Separator = (
  <li role="separator" className={classes.separator}>
    <div />
  </li>
);
const timeoutMilliseconds = 150;

type Props = {
  user: any;
  getMenuStyle?(): React.CSSProperties;
};

const transitionClassNames: CSSTransitionClassNames = {
  enter: classes.menuEnter,
  enterActive: classes.menuEnterActive,
  exit: classes.menuExit,
  exitActive: classes.menuExitActive,
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
      <nav className={classes.root}>
        <Menu
          className={classes.menu}
          aria-label="Main Menu"
          style={
            {
              '--timeout': `${timeoutMilliseconds}ms`,
            } as any
          }
        >
          {({ isOpen }: { isOpen: boolean }) => (
            <CSSTransition
              classNames={transitionClassNames}
              timeout={timeoutMilliseconds}
              in={isOpen}
              mountOnEnter
              unmountOnExit
            >
              <div className={classes.body} style={getMenuStyle()}>
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
                  type="button"
                  className={classes.close}
                  onClick={this.closeMenu}
                  icon={<SvgIcon size={16} {...closeIcon} />}
                  aria-label="Close"
                />
                {Separator}
                <MenuItemWithLink size="small" to="/privacy-policy">
                  Privacy Policy
                </MenuItemWithLink>
                <div className={classes.footer}>
                  <div className={classes.copy}>&copy; 2018 Hollowverse</div>
                </div>
              </div>
            </CSSTransition>
          )}
        </Menu>
      </nav>
    );
  }
}
