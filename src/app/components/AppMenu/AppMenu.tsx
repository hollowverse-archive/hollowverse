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
import closeIcon from 'icons/close.svg';
import facebookIcon from 'icons/facebook.svg';

import classes from './AppMenu.module.scss';
import { ViewerQuery } from 'api/types';
import {
  AsyncResult,
  isSuccessResult,
  isPendingResult,
} from 'helpers/asyncResults';
import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';

const Separator = (
  <div role="separator" className={classes.separator}>
    <div />
  </div>
);

const transitionTimeoutMilliseconds = 150;

export type StateProps = {
  viewerQueryResult: AsyncResult<ViewerQuery>;
};

export type DispatchProps = {
  requestLogin(payload: undefined): void;
  requestLogout(payload: undefined): void;
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
    const { viewerQueryResult } = this.props;

    if (
      !isSuccessResult(viewerQueryResult) ||
      !viewerQueryResult.value.viewer
    ) {
      return undefined;
    }

    const { viewer } = viewerQueryResult.value;

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

  renderLoginButton = () => {
    const { viewerQueryResult } = this.props;
    const isChecking = isPendingResult(viewerQueryResult);
    const canLogIn = !isChecking;
    const isLoggedIn =
      isSuccessResult(viewerQueryResult) &&
      viewerQueryResult.value.viewer !== null;
    const loggedOut = !isLoggedIn && !isChecking;

    /* eslint-disable no-nested-ternary */

    return (
      <MenuItemWithButton
        className={loggedOut ? classes.facebook : undefined}
        type="button"
        onClick={this.handleLoginClick}
        disabled={!canLogIn}
        icon={
          loggedOut ? (
            <SvgIcon
              className={classes.facebookIcon}
              size={20}
              {...facebookIcon}
            />
          ) : isChecking ? (
            <LoadingSpinner size={24} />
          ) : (
            undefined
          )
        }
      >
        {isLoggedIn
          ? 'Log out'
          : isChecking
            ? 'Checking log in...'
            : 'Log in with Facebook'}
      </MenuItemWithButton>
    );
  };

  handleLoginClick = () => {
    const { viewerQueryResult, requestLogin, requestLogout } = this.props;

    if (isSuccessResult(viewerQueryResult) && viewerQueryResult.value.viewer) {
      requestLogout(undefined);
    } else if (!isPendingResult(viewerQueryResult)) {
      requestLogin(undefined);
    }
  };

  closeMenu = () => {
    closeMenu('app-menu-wrapper');
  };

  render() {
    const { getMenuStyle = () => undefined } = this.props;

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
              <div className={classes.body} style={getMenuStyle()}>
                {this.renderUser()}
                <MenuItemWithLink to="/">Home</MenuItemWithLink>
                <MenuItemWithLink to="/contact">Contact</MenuItemWithLink>
                {Separator}
                {this.renderLoginButton()}
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
              </div>
            </CSSTransition>
          )}
        </Menu>
      </nav>
    );
  }
}
