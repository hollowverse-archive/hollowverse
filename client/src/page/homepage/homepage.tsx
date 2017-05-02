import * as React from 'react'
import {connect} from 'react-redux'
import {actions} from '../../redux/actions'
import {State} from '../../redux/reducers'
import {pick} from '../../utils/utils'
import {Form} from '../../component/form'
import * as selectors from '../../redux/selectors'
import {FadeInUp} from '../../component/animations'
import {IAlgoliaSearchResults} from '../../vendor/algolia'
import {RouteComponentProps} from 'react-router-dom'

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
      <div className='pageHomepage'>
        <section className='hero is-light overflowHidden'>
          <div className='hero-body fontAwesomeBackgroundImageWrapper'>
            <div className='container fontAwesomeBackgroundImageInner'>
              <h1 className='title'>Enter a name of a famous person</h1>

              <Form onSubmit={() => this.submitSearchTerm()} className='searchForm'>
                <FadeInUp>
                  {!p.hasResults && p.searchResults !== undefined && (
                    <div className='text-center'>
                      <div className='notification is-warning hv-has-shadow'>
                        <a className='delete' onClick={() => p.setSearchResults(undefined)} />
                        <p>
                          We don't have a page for "{p.searchTerm}", yet
                        </p>
                      </div>
                    </div>
                  )}
                </FadeInUp>

                <p className='control'>
                  <input
                    maxLength={50}
                    className='input'
                    type='text'
                    value={p.searchInputValue}
                    onChange={({target: {value}}) => this.handleSearchInputChange(value)}
                  />
                </p>

                <div className='searchButtonContainer'>
                  <a className='button is-primary is-large' onClick={() => this.submitSearchTerm()}>
                    Search
                  </a>
                </div>
              </Form>
            </div>
          </div>
        </section>
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
