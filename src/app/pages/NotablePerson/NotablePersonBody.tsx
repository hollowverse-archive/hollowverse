import React from 'react';
import { NotablePersonQuery } from 'api/types';
import { PersonDetails } from 'components/PersonDetails/PersonDetails';
import { NotablePersonBodyDummyData } from './NotablePersonBodyDummyData';
import {
  withStyles,
  createStyles,
  Theme,
  WithStyles,
} from '@material-ui/core/styles';

const styles = (_: Theme) =>
  createStyles({
    root: {
      width: '100%',
      // `!important` is needed here to override `> * { max-width: $max-page-width }`
      // in `NotablePerson.tsx`
      maxWidth: '100% !important',
    },
    article: {
      display: 'flex',
      flexDirection: 'column',
    },
  });

type Props = {
  notablePerson?: NonNullable<NotablePersonQuery['notablePerson']>;
  editorialSummary?: JSX.Element;
} & WithStyles<ReturnType<typeof styles>>;

export const NotablePersonBody = withStyles(styles)(
  class extends React.PureComponent<Props> {
    render() {
      const { notablePerson, classes, editorialSummary } = this.props;

      const { name, mainPhoto, summary } =
        notablePerson === undefined
          ? NotablePersonBodyDummyData
          : notablePerson;

      return (
        <main className={classes.root}>
          <article className={classes.article}>
            <PersonDetails
              name={name}
              photo={mainPhoto}
              summary={summary}
              isLoading={!notablePerson}
            />

            {editorialSummary}
          </article>
        </main>
      );
    }
  },
);
