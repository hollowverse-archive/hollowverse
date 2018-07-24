import React from 'react';
import { AlgoliaResponse } from 'algoliasearch';
import { Link } from 'react-router-dom';
import cc from 'classcat';

import { resultsListDummyData } from './ResultsListDummyData';

import classes from './ResultsList.module.scss';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';

export type ResultsListSuccessProps = {
  hits: AlgoliaResponse['hits'];
  onResultClick(path: string): any;
};

export type ResultsListProps =
  | {
      isLoading: true;
    }
  | ResultsListSuccessProps;

export const ResultsList = (props: ResultsListProps) => {
  const isLoading = 'isLoading' in props;
  const { hits, onResultClick } =
    'isLoading' in props ? resultsListDummyData : props;

  return (
    <List
      component="ol"
      aria-label="Search Results"
      className={classes.root}
      aria-hidden={isLoading}
    >
      {hits.map(searchResult => {
        const Wrapper = isLoading ? 'span' : Link;
        const photo = searchResult.mainPhoto;
        const path = `/${searchResult.slug}`;
        const onClick = () => {
          onResultClick(path);
        };

        return (
          <ListItem
            key={searchResult.objectID}
            className={cc([classes.result, { [classes.isLoading]: isLoading }])}
            component={Wrapper as any}
            {...{ to: path } as any}
            onClick={onClick}
          >
            <Avatar role="presentation" src={photo ? photo.url : undefined} />
            <ListItemText className={classes.text}>
              {searchResult.name}
            </ListItemText>
          </ListItem>
        );
      })}
    </List>
  );
};
