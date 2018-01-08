import * as React from 'react';
import { StoreState } from 'store/types';

import * as classes from './SearchResults.module.scss';

import FlipMove from 'react-flip-move';
import { Card } from 'components/Card/Card';
import {
  AsyncResult,
  isPendingResult,
  isSuccessResult,
  isOptimisticResult,
} from 'helpers/asyncResults';
import { AlgoliaResponse } from 'algoliasearch';
import { connect } from 'react-redux';
import { getSearchQuery } from 'store/features/search/selectors';
import { Link } from 'react-router-dom';
import { WithData } from 'hocs/WithData/WithData';
import { Square } from 'components/Square/Square';
import { Status } from 'components/Status/Status';
import { SearchResultsSkeleton } from './SearchResultsSkeleton';

import algoliaLogo from '!!file-loader!svgo-loader!assets/algoliaLogo.svg';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';

import searchIcon from 'icons/search.svg';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { LinkButton } from 'components/Button/Button';
import { forceReload } from 'helpers/forceReload';

type Props = {
  searchQuery: string | null;
};

const ResultsList = ({ hits }: { hits: AlgoliaResponse['hits'] }) => {
  return (
    <FlipMove
      typeName="ol"
      enterAnimation="fade"
      leaveAnimation="fade"
      duration={100}
    >
      {hits.map(searchResult => {
        const photo = searchResult.mainPhoto;

        return (
          <li key={searchResult.objectID} className={classes.result}>
            <Link className={classes.link} to={`/${searchResult.slug}`}>
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
    </FlipMove>
  );
};

class Page extends React.PureComponent<Props> {
  load = async (): Promise<null | AlgoliaResponse> => {
    const { searchQuery } = this.props;

    if (searchQuery) {
      return import('vendor/algolia').then(({ notablePeople }) =>
        notablePeople.search(searchQuery),
      );
    }

    return null;
  };

  render() {
    const { searchQuery } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.resultsContainer}>
          <WithData
            requestId={searchQuery}
            dataKey="searchResults"
            load={this.load}
            allowOptimisticUpdates
          >
            {({ result }: { result: AsyncResult<AlgoliaResponse | null> }) => {
              if (isSuccessResult(result) || isOptimisticResult(result)) {
                const value = result.value;

                if (!searchQuery || !value) {
                  return null;
                }

                if (value.hits.length === 0) {
                  return (
                    <MessageWithIcon
                      className={classes.placeholder}
                      icon={<SvgIcon {...searchIcon} />}
                      title="No results found"
                    >
                      <Status key={searchQuery} code={404} />
                    </MessageWithIcon>
                  );
                }

                if (
                  // If the page is accessed without JS and we only have one
                  // matching result, redirect to the result's page instead
                  // of showing the search results page.
                  __IS_SERVER__ &&
                  value.hits.length === 1
                ) {
                  return (
                    <Status code={301} redirectTo={`${value.hits[0].slug}`} />
                  );
                }

                return (
                  <div>
                    <Card className={classes.card}>
                      <ResultsList hits={value.hits} />
                      <Status key={searchQuery} code={200} />
                    </Card>
                  </div>
                );
              }

              if (isPendingResult(result)) {
                return <SearchResultsSkeleton />;
              }

              return (
                <MessageWithIcon
                  className={classes.placeholder}
                  icon={<SvgIcon {...searchIcon} />}
                  title="Failed to load search results"
                  button={
                    <LinkButton to={location} onClick={forceReload}>
                      Reload
                    </LinkButton>
                  }
                >
                  <Status code={500} />
                </MessageWithIcon>
              );
            }}
          </WithData>
        </div>
        <small className={classes.algoliaContainer}>
          Search powered by
          <img className={classes.logo} src={algoliaLogo} alt="Algolia" />
        </small>
      </div>
    );
  }
}

export const SearchResults = connect((state: StoreState) => ({
  searchQuery: getSearchQuery(state),
}))(Page);
