// import * as React from "react";
// import {connect} from 'react-redux'
// import * as thunks from './redux.thunks'
// import {State} from './redux.reducers'
// import {pick} from './utils'
// import {RouteComponentProps} from './common.types'
// import * as selectors from './redux.selectors'
// import {Link} from 'react-router'
//
// import queryString = require('query-string')
//
// interface Props {
//   searchTerm: string,
//   numberOfSearchHits: number,
//   isSearchPending: boolean
// }
//
// function mapStateToProps(state: State, props: RouteComponentProps<any, any>): Props {
//   return {
//     searchTerm: queryString.parse(props.location.search).q as string,
//     numberOfSearchHits: selectors.getNumberOfSearchHits(state),
//     ...pick(state, [
//       'isSearchPending'
//     ])
//   }
// }
//
// const actionCreators = pick(thunks, [
//   'getSearchResults'
// ])
//
// type ActionCreators = typeof actionCreators
//
// class Search extends React.Component<Props & ActionCreators, undefined> {
//   componentDidMount() {
//     this.props.getSearchResults(this.props.searchTerm)
//   }
//
//   render() {
//     const {props: p} = this
//
//     return (
//       <div className="pageSearch">
//         {!p.isSearchPending && (
//           (p.numberOfSearchHits > 0) ?
//             this.searchResults() :
//             (p.numberOfSearchHits === 0) ?
//               this.noResults() :
//               null
//         )}
//       </div>
//     )
//   }
//
//   searchResults() {
//     return (
//       <p>Search results for "{this.props.searchTerm}"</p>
//     )
//   }
//
//   noResults() {
//     return (
//       <div className="noResults">
//         <section className="hero is-light overflowHidden">
//           <div className="hero-body fontAwesomeBackgroundImageWrapper">
//             <div className="container fontAwesomeBackgroundImageInner">
//               <p className="title is-4">
//                 No one has created a page for
//                 <br/>"{this.props.searchTerm}", yet.
//               </p>
//               <p className="subtitle is-6">Go ahead and create one!</p>
//
//               <div className="createAProfileButtonContainer">
//                 <Link to="/create-new-page" className="button is-primary is-medium">
//                   Create a page
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     )
//   }
// }
//
// export default connect(mapStateToProps, actionCreators)(Search)
