import React from 'react';
import { Menu, closeMenu } from 'react-aria-menubutton';
import CSSTransition, {
  CSSTransitionClassNames,
} from 'react-transition-group/CSSTransition';
import {
  MenuItemWithLink,
  MenuItemWithButton,
  MenuItemWithChild,
} from './MenuItem';

import { PersonPhoto } from 'components/PersonPhoto/PersonPhoto';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { Paper } from 'components/Paper/Paper';
import closeIcon from 'icons/close.svg';
import facebookIcon from 'icons/facebook.svg';

import classes from './AppMenu.module.scss';

const Separator = (
  <div role="separator" className={classes.separator}>
    <div />
  </div>
);

const transitionTimeoutMilliseconds = 150;

export type StateProps = {
  user?: any;
};

export type DispatchProps = {
  toggleAuthStatus(payload: undefined): void;
};

export type OwnProps = {
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

  handleLoginClick = () => {
    this.props.toggleAuthStatus(undefined);
  };

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
                <MenuItemWithButton
                  className={user ? undefined : classes.facebook}
                  type="button"
                  onClick={this.handleLoginClick}
                  icon={
                    user ? (
                      undefined
                    ) : (
                      <SvgIcon
                        className={classes.facebookIcon}
                        color="var(--facebook-blue)"
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
              </Paper>
            </CSSTransition>
          )}
        </Menu>
      </nav>
    );
  }
}
