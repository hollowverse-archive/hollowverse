import * as React from 'react'
import {css} from 'aphrodite/no-important'
import {RouteComponentProps} from 'react-router-dom'
import {connect} from 'react-redux'
import {actions} from '../../redux/actions'
import {State} from '../../redux/reducers'
import * as selectors from '../../redux/selectors'
import {pick} from '../../utils/utils'
import {Form} from '../../components/form'
import {IAlgoliaSearchResults} from '../../vendor/algolia'
import {styles} from './homepage.styles'
import {common} from '../../common.styles'

interface Props {
  searchInputValue: string,
  searchTerm: string,
  searchResults: IAlgoliaSearchResults | undefined,
  lastSearchTerm: string,
  hasResults: boolean,
}

function mapStateToProps(state: State): Props {
  return {
    searchTerm: state.routing && state.routing.location && state.routing.location.search || '',
    hasResults: selectors.hasResults(state),
    ...pick(state, [
      'searchResults',
      'searchInputValue',
      'lastSearchTerm',
    ]),
  }
}

const actionCreators = pick(actions, [
  'setSearchInputValue',
  'requestSearchResults',
  'setSearchResults',
  'setLastSearchTerm',
  'navigateToSearch',
])

type ActionCreators = typeof actionCreators
type ComponentProps = ActionCreators & Props & RouteComponentProps<any>

class HomepageClass extends React.Component<ComponentProps, undefined> {
  componentDidMount() {
    this.search()
  }

  componentDidUpdate() {
    this.search()
  }

  render() {
    const {props: p} = this

    return (
      <div className={css(styles.pageHomepage)}>
        <div className={css(styles.searchContainer)}>
          <h1 className={css(common.titleTypography, styles.title)}>Enter a name of a famous person</h1>
          <Form className={css(styles.searchForm)} onSubmit={() => this.submitSearchTerm()}>
            <p>
              <input
                maxLength={50}
                className={css(common.textTypography, styles.searchInput)}
                type='text'
                value={p.searchInputValue}
                onChange={({target: {value}}) => this.handleSearchInputChange(value)}
              />
            </p>
            <div className={css(styles.searchButtonContainer)}>
              <a
                className={css(common.textTypography, common.palette, styles.searchButton)}
                onClick={() => this.submitSearchTerm()}
              >
                Search
              </a>
            </div>
          </Form>
        </div>
      </div>
    )
  }

  handleSearchInputChange(searchText: string) {
    const {props: p} = this

    p.setSearchInputValue(searchText)

    if (!p.hasResults) {
      p.setSearchResults(undefined)
    }
  }

  submitSearchTerm() {
    const {props: p} = this

    if (p.searchInputValue) {
      p.navigateToSearch(p.searchInputValue)
    }
  }

  search() {
    const {props: p} = this

    if (p.lastSearchTerm !== p.searchTerm && p.searchTerm !== '') {
      p.setLastSearchTerm(p.searchTerm)
      p.requestSearchResults(p.searchTerm)
    }
  }
}

export const Homepage = connect<Props, ActionCreators, RouteComponentProps<any>>(
  mapStateToProps,
  actionCreators,
)(HomepageClass)
