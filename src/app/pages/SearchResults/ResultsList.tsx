import React from 'react';
import { AlgoliaResponse } from 'algoliasearch';
import { Link } from 'react-router-dom';

import { Square } from 'components/Square/Square';
import classes from './SearchResults.module.scss';
import { resultsListDummyData } from './ResultsListDummyData';

type ResultsListProps = Partial<{
  hits: AlgoliaResponse['hits'];
  isLoading: boolean;
  onResultClick(path: string): any;
}>;

export const ResultsList = (props: ResultsListProps) => {
  const { hits, onResultClick, isLoading } = {
    ...resultsListDummyData,
    ...props,
  };

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
          <li key={searchResult.objectID} className={classes.result}>
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
              <div className={classes.text}>{searchResult.name}</div>
            </Wrapper>
          </li>
        );
      })}
    </ol>
  );
};
