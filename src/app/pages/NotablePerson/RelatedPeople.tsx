import React from 'react';

import { Square } from 'components/Square/Square';
import Card from '@material-ui/core/Card';
import { Link } from 'react-router-dom';
import { PersonPhoto } from 'components/PersonPhoto/PersonPhoto';
import Typography from '@material-ui/core/Typography';
import {
  withStyles,
  createStyles,
  Theme,
  WithStyles,
} from '@material-ui/core/styles';

const styles = ({ breakpoints, palette, spacing }: Theme) =>
  createStyles({
    root: {
      width: '100%',
      listStyle: 'none',
      maxWidth: breakpoints.values.sm,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      padding: `0 ${spacing.unit * 2}px`,

      /**
       * Enable momentum-based scrolling, Safari only
       * See https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-overflow-scrolling
       */
      '-webkit-overflow-scrolling': 'touch',
      overflowX: 'scroll',

      '@media (pointer: coarse)': {
        '-ms-overflow-style': 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },

      '& li > *': {
        width: '100%',
      },
      '& a': {
        color: 'initial',
        textDecoration: 'none',
      },
    },

    square: {
      minWidth: 120,
      minHeight: 120,
      backgroundColor: palette.background.default,
      flexGrow: 0,
    },

    link: {
      display: 'block',
      height: '100%',
    },

    person: {
      display: 'flex',
      flex: '1 0 calc(25% - 5px)',
      maxWidth: breakpoints.values.sm / 4,
      alignItems: 'flex-start',
      fontWeight: 'bold',
      padding: 5,

      '& img': {
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
    },
  });

type Person = {
  slug: string;
  name: string;
  mainPhoto: {
    url: string;
  } | null;
};

type Props = { people: Person[] } & WithStyles<ReturnType<typeof styles>>;

export const RelatedPeople = withStyles(styles)(
  ({ classes, people }: Props) => (
    <ul className={classes.root}>
      {people.map(person => (
        <li key={person.slug} className={classes.person}>
          <Link className={classes.link} to={`/${person.slug}`}>
            <Card square={false}>
              <Square className={classes.square}>
                <PersonPhoto
                  isLazy
                  alt={`${person.name}'s photo`}
                  src={person.mainPhoto ? person.mainPhoto.url : undefined}
                />
              </Square>
            </Card>
            <Typography gutterBottom align="center">
              {person.name}
            </Typography>
          </Link>
        </li>
      ))}
    </ul>
  ),
);
