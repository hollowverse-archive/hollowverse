import React from 'react';
import { AlgoliaResponse } from 'algoliasearch';
import { Link } from 'react-router-dom';

import { Square } from 'components/Square/Square';
import classes from './SearchResults.module.scss';

type ResultsListProps = {
  hits: AlgoliaResponse['hits'];
  onResultClick(path: string): any;
};

export const ResultsList = ({ hits, onResultClick }: ResultsListProps) => {
  return (
    <ol>
      {hits.map(searchResult => {
        const photo = searchResult.mainPhoto;
        const path = `/${searchResult.slug}`;
        const onClick = () => {
          onResultClick(path);
        };

        return (
          <li key={searchResult.objectID} className={classes.result}>
            <Link className={classes.link} to={path} onClick={onClick}>
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
            </Link>
          </li>
        );
      })}
    </ol>
  );
};
