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
import { ViewerQuery } from 'api/types';

const Separator = (
  <div role="separator" className={classes.separator}>
    <div />
  </div>
);

const transitionTimeoutMilliseconds = 150;

export type StateProps = {};

export type DispatchProps = {
  toggleAuthStatus(payload: undefined): void;
};

export type OwnProps = {
  viewer?: ViewerQuery['viewer'];
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
    const { viewer } = this.props;

    if (!viewer) {
      return undefined;
    }

    return (
      <MenuItemWithChild
        aria-label={`Signed in as ${viewer.name}`}
        factory="div"
        isClickable={false}
      >
        <PersonPhoto
          alt="Profile Photo"
          className={classes.userAvatar}
          src={viewer.photoUrl || undefined}
        />
        <div className={classes.userName}>{viewer.name}</div>
      </MenuItemWithChild>
    );
  };

  handleLoginClick = () => {
    // this.props.toggleAuthStatus(undefined);
    FB.login(response => {
      console.log(response);
    });
  };

  closeMenu = () => {
    closeMenu('app-menu-wrapper');
  };

  render() {
    const { viewer, getMenuStyle = () => undefined } = this.props;

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
                  className={viewer ? undefined : classes.facebook}
                  type="button"
                  onClick={this.handleLoginClick}
                  icon={
                    viewer ? (
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
                  {viewer ? 'Log out' : 'Log in with Facebook'}
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
