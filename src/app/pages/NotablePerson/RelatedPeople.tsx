import React from 'react';

import classes from './RelatedPeople.module.scss';

import { Square } from 'components/Square/Square';
import { Card } from 'components/Card/Card';
import { Link } from 'react-router-dom';
import { NotablePersonPhoto } from 'components/NotablePersonPhoto/NotablePersonPhoto';

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
                <NotablePersonPhoto
                  isLazy
                  outerClassName={classes.lazyImage}
                  alt={person.name}
                  src={person.mainPhoto ? person.mainPhoto.url : undefined}
                />
              </Square>
              <div className={classes.name}>{person.name}</div>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
};
