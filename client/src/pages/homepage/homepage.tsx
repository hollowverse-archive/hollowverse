import { css } from 'aphrodite/no-important';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { common } from 'common.styles';
import { Form } from 'components/form';
import { DefaultDispatchProps } from 'store/types';
import { State } from 'store/reducers';
import * as selectors from 'store/selectors';
import pick from 'lodash/pick';
import { IAlgoliaSearchResults } from 'vendor/algolia';
import { styles } from './homepage.styles';

interface StateProps {
  searchInputValue: string;
  searchTerm: string;
  searchResults: IAlgoliaSearchResults | null;
  lastSearchTerm: string;
  hasResults: boolean;
}

function mapStateToProps(state: State): StateProps {
  return {
    searchTerm:
      (state.routing &&
        state.routing.location &&
        state.routing.location.search) ||
      '',
    hasResults: selectors.hasResults(state),
    ...pick(state, ['searchResults', 'searchInputValue', 'lastSearchTerm']),
  };
}

import {
  setSearchInputValue,
  requestSearchResults,
  setSearchResults,
  setLastSearchTerm,
  navigateToSearch,
} from 'store/features/search/actions';

type MergedProps = StateProps & DefaultDispatchProps;
type IProps = MergedProps & RouteComponentProps<{}>;

class HomepageClass extends React.PureComponent<IProps, {}> {
  componentDidMount() {
    this.search();
  }

  componentDidUpdate() {
    this.search();
  }

  render() {
    const { props: p } = this;

    return (
      <div className={css(styles.pageHomepage)}>
        <div className={css(styles.searchContainer)}>
          <h1 className={css(common.titleTypography, styles.title)}>
            Enter a name of a famous person
          </h1>
          <Form className={css(styles.searchForm)} onSubmit={this.handleSubmit}>
            <p>
              <input
                maxLength={50}
                className={css(common.textTypography, styles.searchInput)}
                type="text"
                value={p.searchInputValue}
                onChange={this.handleSearchInputChange}
              />
            </p>
            <div className={css(styles.searchButtonContainer)}>
              <button
                className={css(
                  common.textTypography,
                  common.palette,
                  styles.searchButton,
                )}
                onClick={this.handleSubmit}
              >
                Search
              </button>
            </div>
          </Form>
        </div>
      </div>
    );
  }

  handleSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value: searchText },
  }) => {
    const { hasResults, dispatch } = this.props;

    dispatch(setSearchInputValue(searchText));

    if (!hasResults) {
      dispatch(setSearchResults(undefined));
    }
  };

  handleSubmit: React.FormEventHandler<HTMLElement> = _ => {
    const { searchInputValue, dispatch } = this.props;

    if (searchInputValue) {
      dispatch(navigateToSearch(searchInputValue));
    }
  };

  search() {
    const { lastSearchTerm, searchTerm, dispatch } = this.props;

    if (lastSearchTerm !== searchTerm && searchTerm !== '') {
      dispatch(setLastSearchTerm(searchTerm));
      dispatch(requestSearchResults(searchTerm));
    }
  }
}

export const Homepage = connect<IProps, StateProps>(mapStateToProps)(
  HomepageClass,
);
