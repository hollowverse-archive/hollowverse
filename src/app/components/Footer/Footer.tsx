import React from 'react';

import { Link } from 'react-router-dom';

import logo from 'file-loader!assets/favicon.png';

import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      fontSize: 13,
      margin: `${theme.spacing.unit * 5}px 0`,
      color: theme.palette.text.secondary,
      textAlign: 'center',
    },
    logo: {
      height: 25,
      width: 'auto',
      filter: 'grayscale(100%) opacity(0.6)',
    },
    list: {
      listStyle: 'none',
      '& > *': {
        display: 'inline',
      },
      '& a': {
        textDecoration: 'none',
        color: 'inherit',
      },
      '& > * + *::before': {
        content: '"·"',
        margin: `0 ${theme.spacing.unit}px`,
      },
    },
  });

type Props = WithStyles<ReturnType<typeof styles>>;

export const Footer = withStyles(styles)(({ classes }: Props) => (
  <footer className={classes.root}>
    <ul className={classes.list}>
      <li>
        <Link to="/contact">Contact us</Link>
      </li>
      <li>
        <Link to="/privacy-policy">Privacy</Link>
      </li>
      <li>
        <a href="https://www.facebook.com/The-Hollowverse-206704599442186/">
          Facebook
        </a>
      </li>
    </ul>
    <br />
    <img
      className={classes.logo}
      role="presentation"
      alt={undefined}
      src={logo}
    />
  </footer>
));
