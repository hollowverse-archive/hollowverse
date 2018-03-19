import React from 'react';
import { AlgoliaResponse } from 'algoliasearch';
import { Link } from 'react-router-dom';
import cc from 'classcat';

import { Square } from 'components/Square/Square';
import { resultsListDummyData } from './ResultsListDummyData';

import classes from './SearchResults.module.scss';

export type ResultsListProps = {
  hits: AlgoliaResponse['hits'];
  isLoading: boolean;
  onResultClick(path: string): any;
};

export const ResultsList = (props: ResultsListProps) => {
  const { isLoading } = props;
  const { hits, onResultClick } = isLoading ? props : resultsListDummyData;

  return (
    <ol>
      {hits.map(searchResult => {
        const Wrapper = isLoading ? 'span' : Link;
        const photo = searchResult.mainPhoto;
        const path = `/${searchResult.slug}`;
        const onClick = () => {
          onResultClick(path);
        };

        return (
          <li
            key={searchResult.objectID}
            className={cc([classes.result, { [classes.isLoading]: isLoading }])}
          >
            <Wrapper className={classes.link} to={path} onClick={onClick}>
              <div className={classes.photo}>
                <Square>
                  <img
                    src={photo ? photo.url : null}
                    role="presentation"
                    alt={undefined}
                  />
                </Square>
              </div>
              <div className={classes.nameContainer}>
                <span className={classes.text}>{searchResult.name}</span>
              </div>
            </Wrapper>
          </li>
        );
      })}
    </ol>
  );
};
