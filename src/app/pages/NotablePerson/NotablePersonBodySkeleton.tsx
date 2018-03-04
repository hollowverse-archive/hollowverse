import React from 'react';
import { NotablePersonQuery } from 'api/types';
import { PersonDetails } from 'components/PersonDetails/PersonDetails';
import { NotablePersonBodySkeletonData } from './NotablePersonBodySkeletonData';

import classes from './NotablePersonBodySkeleton.module.scss';

type Props = {
  notablePerson?: NotablePersonQuery['notablePerson'];
  editorialSummary?: JSX.Element;
};

export const NotablePersonBodySkeleton = ({
  notablePerson,
  editorialSummary,
}: Props) => {
  const dataSource = !notablePerson
    ? NotablePersonBodySkeletonData
    : notablePerson;

  const { name, mainPhoto, summary } = dataSource;

  return (
    <article className={classes.root}>
      <PersonDetails
        name={name}
        photo={mainPhoto}
        summary={summary}
        isLoading={!notablePerson}
      />

      {editorialSummary ? editorialSummary : null}
    </article>
  );
};
