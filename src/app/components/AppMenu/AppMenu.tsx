import React from 'react';
import { Link } from 'react-router-dom';
import cc from 'classcat';
import { Menu, MenuItem } from 'react-aria-menubutton';

import classes from './AppMenu.module.scss';

type Props = {
  isOpen: boolean;
  user: any;
};

export class AppMenu extends React.PureComponent<Props> {
  defaultProps: Partial<Props> = {
    isOpen: true,
    user: {
      name: 'Fawwaz Orabi',
      avatar: 'test',
    },
  };

  renderUser = () => {
    const { user } = this.props;

    if (!user) {
      return undefined;
    }

    return (
      <>
        <div
          className={classes.userAvatar}
          style={{
            backgroundImage: user.avatar ? `url(${user.avatar})` : undefined,
          }}
        />
        <div className={classes.userName}>{user.name}</div>
      </>
    );
  };

  renderMenuLinks = () => null;

  handleClose = () => null;

  handleLogin = () => null;
  handleLogout = () => null;

  render() {
    const { user } = this.props;

    return (
      <Menu className={classes.root}>
        <button
          type="button"
          title="Close menu"
          aria-label="Close menu"
          className={classes.fade}
          onClick={this.handleClose}
        />
        <div className={classes.body}>
          <button
            type="button"
            title="Close menu"
            aria-label="Close menu"
            className={classes.close}
            onClick={this.handleClose}
          />
          {this.renderUser()}
          <ul className={classes.link}>
            <MenuItem>
              <li>
                <Link to="/" className={classes.link}>
                  Home
                </Link>
              </li>
            </MenuItem>
            <MenuItem>
              <li>
                <Link to="/contact" className={classes.link}>
                  Contact
                </Link>
              </li>
            </MenuItem>
            <div className={classes.separator} />
            <MenuItem>
              <li>
                {user && (
                  <button
                    type="button"
                    className={classes.link}
                    onClick={this.handleLogout}
                  >
                    Log out
                  </button>
                )}
                {!user && (
                  <button
                    type="button"
                    className={cc([classes.link, classes.facebook])}
                    onClick={this.handleLogin}
                  >
                    Log in with Facebook
                  </button>
                )}
              </li>
            </MenuItem>
          </ul>
          <div className={classes.footer}>
            <Link to="/privacy-policy" className={classes.link}>
              Privacy Policy
            </Link>
            <div className={classes.copy}>&copy; 2018 Hollowverse</div>
          </div>
        </div>
      </Menu>
    );
  }
}
