import React from 'react';
import cc from 'classcat';
import Helmet from 'react-helmet-async';

import { NotablePersonQuery } from 'api/types';
import { PersonDetails } from 'components/PersonDetails/PersonDetails';
import { FbComments } from 'components/FbComments/FbComments';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { OptionalIntersectionObserver } from 'components/OptionalIntersectionObserver/OptionalIntersectionObserver';
import { Card } from 'components/Card/Card';
import { EditorialSummary } from 'components/EditorialSummary/EditorialSummary';
import { Status } from 'components/Status/Status';
import { RelatedPeople } from './RelatedPeople';
import { DispatchOnLifecycleEvent } from 'components/DispatchOnLifecycleEvent/DispatchOnLifecycleEvent';

import classes from './NonErrorNotablePerson.module.scss';

import { setAlternativeSearchBoxText } from 'store/features/search/actions';
import { isWhitelistedPage } from 'redirectionMap';

import { warningIcon } from './warningIcon';

type NonErrorProps = {
  notablePerson: NotablePersonQuery['notablePerson'];
};

export const NonErrorNotablePerson = ({ notablePerson }: NonErrorProps) => {
  if (!notablePerson) {
    return (
      <MessageWithIcon title="Not Found" icon={warningIcon}>
        <Status code={404} />
      </MessageWithIcon>
    );
  }

  const {
    name,
    mainPhoto,
    summary,
    commentsUrl,
    editorialSummary,
    slug,
  } = notablePerson;

  const isWhitelisted = isWhitelistedPage(`/${slug}`);

  return (
    <div className={classes.root}>
      <Helmet>
        <link
          rel="canonical"
          href={
            isWhitelisted
              ? String(new URL(`${slug}`, 'https://hollowverse.com'))
              : commentsUrl
          }
        />
        <title>{`${name}'s Religion and Political Views`}</title>
      </Helmet>
      <Status code={200} />
      <DispatchOnLifecycleEvent
        onWillUnmount={setAlternativeSearchBoxText(null)}
        onWillMount={setAlternativeSearchBoxText(notablePerson.name)}
      />
      <article className={classes.article}>
        <PersonDetails name={name} photo={mainPhoto} summary={summary} />
        {editorialSummary ? (
          <Card className={cc([classes.card, classes.editorialSummary])}>
            <EditorialSummary id={slug} {...editorialSummary} />
          </Card>
        ) : (
          <div className={classes.stub}>
            Share what you know about the religion and political views of {name}{' '}
            in the comments below
          </div>
        )}
      </article>
      {notablePerson.relatedPeople.length ? (
        <div className={classes.relatedPeople}>
          <h2>Other interesting profiles</h2>
          <RelatedPeople people={notablePerson.relatedPeople} />
        </div>
      ) : null}
      <OptionalIntersectionObserver rootMargin="0% 0% 25% 0%" triggerOnce>
        {inView =>
          inView ? (
            <Card className={cc([classes.card, classes.comments])}>
              <FbComments url={commentsUrl} />
            </Card>
          ) : null
        }
      </OptionalIntersectionObserver>
    </div>
  );
};
