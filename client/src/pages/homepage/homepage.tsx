import { css } from 'aphrodite/no-important';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { common } from '../../common.styles';
import { Form } from '../../components/form';
import { actions } from '../../redux/actions';
import { State } from '../../redux/reducers';
import * as selectors from '../../redux/selectors';
import pick from 'lodash/pick';
import { IAlgoliaSearchResults } from '../../vendor/algolia';
import { styles } from './homepage.styles';

interface IProps {
  searchInputValue: string;
  searchTerm: string;
  searchResults: IAlgoliaSearchResults | undefined;
  lastSearchTerm: string;
  hasResults: boolean;
}

function mapStateToProps(state: State): IProps {
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

const actionCreators = pick(actions, [
  'setSearchInputValue',
  'requestSearchResults',
  'setSearchResults',
  'setLastSearchTerm',
  'navigateToSearch',
]);

type ActionCreators = typeof actionCreators;
type ComponentProps = ActionCreators & IProps & RouteComponentProps<any>;

class HomepageClass extends React.Component<ComponentProps, undefined> {
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
          <Form
            className={css(styles.searchForm)}
            onSubmit={() => this.submitSearchTerm()}
          >
            <p>
              <input
                maxLength={50}
                className={css(common.textTypography, styles.searchInput)}
                type="text"
                value={p.searchInputValue}
                onChange={({ target: { value } }) =>
                  this.handleSearchInputChange(value)}
              />
            </p>
            <div className={css(styles.searchButtonContainer)}>
              <a
                className={css(
                  common.textTypography,
                  common.palette,
                  styles.searchButton,
                )}
                onClick={() => this.submitSearchTerm()}
              >
                Search
              </a>
            </div>
          </Form>
        </div>
      </div>
    );
  }

  handleSearchInputChange(searchText: string) {
    const { props: p } = this;

    p.setSearchInputValue(searchText);

    if (!p.hasResults) {
      p.setSearchResults(undefined);
    }
  }

  submitSearchTerm() {
    const { props: p } = this;

    if (p.searchInputValue) {
      p.navigateToSearch(p.searchInputValue);
    }
  }

  search() {
    const { props: p } = this;

    if (p.lastSearchTerm !== p.searchTerm && p.searchTerm !== '') {
      p.setLastSearchTerm(p.searchTerm);
      p.requestSearchResults(p.searchTerm);
    }
  }
}

export const Homepage = connect<
  IProps,
  ActionCreators,
  RouteComponentProps<any>
>(mapStateToProps, actionCreators)(HomepageClass);
