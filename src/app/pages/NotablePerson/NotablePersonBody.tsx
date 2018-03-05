import React from 'react';
import { NotablePersonQuery } from 'api/types';
import { PersonDetails } from 'components/PersonDetails/PersonDetails';
import { NotablePersonBodyDummyData } from './NotablePersonBodyDummyData';

import classes from './NotablePersonBody.module.scss';

type Props = {
  notablePerson?: NotablePersonQuery['notablePerson'];
  editorialSummary?: JSX.Element;
};

export class NotablePersonBody extends React.PureComponent<Props> {
  render() {
    const { notablePerson, editorialSummary } = this.props;
    if (notablePerson === null) {
      return null;
    }

    const { name, mainPhoto, summary } =
      notablePerson === undefined ? NotablePersonBodyDummyData : notablePerson;

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
  }
}
