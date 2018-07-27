import React from 'react';

import classes from './RelatedPeople.module.scss';

import { Square } from 'components/Square/Square';
import Card from '@material-ui/core/Card';
import { Link } from 'react-router-dom';
import { PersonPhoto } from 'components/PersonPhoto/PersonPhoto';
import Typography from '@material-ui/core/Typography';

type Person = {
  slug: string;
  name: string;
  mainPhoto: {
    url: string;
  } | null;
};

export const RelatedPeople = ({ people }: { people: Person[] }) => (
  <ul className={classes.root}>
    {people.map(person => (
      <li key={person.slug} className={classes.person}>
        <Link className={classes.link} to={`/${person.slug}`}>
          <Card>
            <Square className={classes.square}>
              <PersonPhoto
                isLazy
                outerClassName={classes.lazyImage}
                alt={`${person.name}'s photo`}
                src={person.mainPhoto ? person.mainPhoto.url : undefined}
              />
            </Square>
          </Card>
          <Typography align="center">{person.name}</Typography>
        </Link>
      </li>
    ))}
  </ul>
);
