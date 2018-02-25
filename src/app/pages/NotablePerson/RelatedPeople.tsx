import React from 'react';

import classes from './RelatedPeople.module.scss';

import { Square } from 'components/Square/Square';
import { LazyImage } from 'components/LazyImage/LazyImage';
import { Card } from 'components/Card/Card';
import { Link } from 'react-router-dom';

type Person = {
  slug: string;
  name: string;
  mainPhoto: {
    url: string;
  } | null;
};

export const RelatedPeople = ({ people }: { people: Person[] }) => {
  return (
    <ul className={classes.root}>
      {people.map(person => (
        <li key={person.slug} className={classes.person}>
          <Link className={classes.link} to={`/${person.slug}`}>
            <Card className={classes.card}>
              <Square className={classes.square}>
                {person.mainPhoto ? (
                  <LazyImage
                    outerClassName={classes.lazyImage}
                    alt={person.name}
                    src={person.mainPhoto.url}
                  />
                ) : null}
              </Square>
              <div className={classes.name}>{person.name}</div>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
};
