import React from 'react';
import { AlgoliaResponse } from 'algoliasearch';
import { Link } from 'react-router-dom';

import { resultsListDummyData } from './ResultsListDummyData';

import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';

const styles = (_: Theme) =>
  createStyles({
    result: {
      flexBasis: '100%',
      display: 'flex',
    },
  });

export type ResultsListSuccessProps = {
  hits: AlgoliaResponse['hits'];
  onResultClick(path: string): any;
};

export type ResultsListProps =
  | {
      isLoading: true;
    }
  | ResultsListSuccessProps;

type Props = ResultsListProps & WithStyles<ReturnType<typeof styles>>;

export const ResultsList = withStyles(styles)<Props>((props: Props) => {
  const { classes } = props;
  const isLoading = 'isLoading' in props;
  const { hits, onResultClick } =
    'isLoading' in props ? resultsListDummyData : props;

  return (
    <List component="ol" aria-label="Search Results" aria-hidden={isLoading}>
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
            className={classes.result}
            component={Wrapper as any}
            {...{ to: path } as any}
            onClick={onClick}
          >
            <Avatar role="presentation" src={photo ? photo.url : undefined} />
            <ListItemText>{searchResult.name}</ListItemText>
          </ListItem>
        );
      })}
    </List>
  );
});
