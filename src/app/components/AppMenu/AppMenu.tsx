import React from 'react';
import { Link } from 'react-router-dom';
import cc from 'classcat';
import { Menu, MenuItem } from 'react-aria-menubutton';

import classes from './AppMenu.module.scss';
import { SvgIcon } from '../SvgIcon/SvgIcon';
import closeIcon from 'icons/close.svg';

type Props = {
  isOpen: boolean;
  user: any;
};

export class AppMenu extends React.PureComponent<Props> {
  defaultProps: Partial<Props> = {
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
        <div className={classes.body}>
          {this.renderUser()}
          <ul className={classes.links}>
            <MenuItem className={classes.menuItem}>
              <li>
                <Link className={classes.link} to="/">
                  Home
                </Link>
              </li>
            </MenuItem>
            <MenuItem className={classes.menuItem}>
              <li>
                <Link className={classes.link} to="/contact">
                  Contact
                </Link>
              </li>
            </MenuItem>
            <div className={classes.separator} />
            <MenuItem className={classes.menuItem}>
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
            <MenuItem className={cc([classes.menuItem, classes.close])}>
              <li>
                <button type="button" className={classes.link}>
                  <SvgIcon size={16} {...closeIcon} />
                  <span className="sr-only">Close</span>
                </button>
              </li>
            </MenuItem>
          </ul>
          <div className={classes.separator} />
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
