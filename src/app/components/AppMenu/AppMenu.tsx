import React from 'react';
import { Menu, closeMenu } from 'react-aria-menubutton';
import CSSTransition, {
  CSSTransitionClassNames,
} from 'react-transition-group/CSSTransition';
import {
  MenuItemWithLink,
  MenuItemWithButton,
  MenuItemWithChild,
  MenuItemWithToggle,
} from './MenuItem';

import { PersonPhoto } from 'components/PersonPhoto/PersonPhoto';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { Paper } from 'components/Paper/Paper';
import closeIcon from 'icons/close.svg';

import classes from './AppMenu.module.scss';

const Separator = (
  <div role="separator" className={classes.separator}>
    <div />
  </div>
);

const transitionTimeoutMilliseconds = 150;

const isNightModeAvailable =
  'CSS' in window && CSS.supports('color', 'var(--primary)');

export type StateProps = {
  isNightModeEnabled: boolean;
};

export type DispatchProps = {
  toggleNightMode(payload: undefined): void;
};

export type OwnProps = {
  user?: any;
  getMenuStyle?(): React.CSSProperties & {
    '--top': string;
    '--left': string;
  };
};

type Props = OwnProps & StateProps & DispatchProps;

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
      <MenuItemWithChild
        aria-label={`Signed in as ${user.name}`}
        factory="div"
        isClickable={false}
      >
        <PersonPhoto
          alt="Profile Photo"
          className={classes.userAvatar}
          src={user.avatar}
        />
        <div className={classes.userName}>{user.name}</div>
      </MenuItemWithChild>
    );
  };

  renderMenuLinks = () => null;

  handleLogin = () => null;
  handleLogout = () => null;

  closeMenu = () => {
    closeMenu('app-menu-wrapper');
  };

  toggleNightMode = () => {
    this.props.toggleNightMode(undefined);
  };

  render() {
    const { getMenuStyle = () => undefined, isNightModeEnabled } = this.props;

    return (
      <nav className={classes.root}>
        <Menu
          className={classes.menu}
          aria-label="Main Menu"
          style={
            {
              '--timeout': `${transitionTimeoutMilliseconds}ms`,
            } as any
          }
        >
          {({ isOpen }: { isOpen: boolean }) => (
            <CSSTransition
              classNames={transitionClassNames}
              timeout={transitionTimeoutMilliseconds}
              in={isOpen}
              mountOnEnter
              unmountOnExit
            >
              <Paper className={classes.body} style={getMenuStyle()}>
                {this.renderUser()}
                <MenuItemWithLink to="/">Home</MenuItemWithLink>
                <MenuItemWithLink to="/contact">Contact</MenuItemWithLink>
                {Separator}
                {isNightModeAvailable && (
                  <>
                    <MenuItemWithToggle
                      id="night-mode-toggle"
                      defaultChecked={isNightModeEnabled}
                      onChange={this.toggleNightMode}
                    >
                      Night mode
                    </MenuItemWithToggle>

                    {Separator}
                  </>
                )}
                <MenuItemWithButton
                  type="button"
                  className={classes.close}
                  onClick={this.closeMenu}
                  icon={<SvgIcon size={16} {...closeIcon} />}
                  aria-label="Close"
                />
                <MenuItemWithLink size="small" to="/privacy-policy">
                  Privacy Policy
                </MenuItemWithLink>
              </Paper>
            </CSSTransition>
          )}
        </Menu>
      </nav>
    );
  }
}
