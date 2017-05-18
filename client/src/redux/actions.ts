//
// REDUX ACTION CREATORS
//
//
// This file contains:
// * Redux action creators
// * Redux action types
//
import {push} from 'react-router-redux'
import {HvError} from '../../../typings/typeDefinitions'
import {stringEnum} from '../utils/utils'
import {IAlgoliaSearchResults} from '../vendor/algolia'

// Custom type definition of a Redux Action
export interface IAction<PayloadType> { type: string, payload: PayloadType}

// The following are all the actions that can be triggered from within the Hollowverse application
export const actions = {
  navigateToSearch: (payload: string) => {
    return push({
      pathname: '/',
      search: payload,
    })
  },

  // Regular action Types
  setSearchInputValue: (payload: string) => ({type: 'setSearchInputValue', payload}),
  setIsSearchPending: (payload: boolean) => ({type: 'setIsSearchPending', payload}),
  setIsLoginPending: (payload: boolean) => ({type: 'setIsLoginPending', payload}),
  setIsLogoutPending: (payload: boolean) => ({type: 'setIsLogoutPending', payload}),
  setSearchError: (payload: string) => ({type: 'setSearchError', payload}),
  setSearchResults: (payload: IAlgoliaSearchResults | undefined) => ({type: 'setSearchResults', payload}),
  setLoginStatus: (payload: facebookSdk.LoginStatus | undefined) => ({type: 'setLoginStatus', payload}),
  setError: (payload: HvError) => ({type: 'setError', payload}),
  setIsNavMenuOpen: (payload: boolean) => ({type: 'setIsNavMenuOpen', payload}),
  setLastSearchTerm: (payload: string) => ({type: 'setLastSearchTerm', payload}),
  setCreateProfileUrlInputValue: (payload: string) => ({type: 'setCreateProfileUrlInputValue', payload}),
  setEmailInputValue: (payload: string) => ({type: 'setEmailInputValue', payload}),
  setMessageInputValue: (payload: string) => ({type: 'setMessageInputValue', payload}),

  // Redux Sagas triggers
  requestSearchResults: (payload: string) => ({type: 'requestSearchResults', payload}),
  requestLogin: () => ({type: 'requestLogin'}),
  requestLogout: () => ({type: 'requestLogout'}),
  requestUpdateLoginStatus: () => ({type: 'requestUpdateLoginStatus'}),
}

// `ActionTypes` can have any string value that corresponds with a key in the `actions` object above
// so `navigateToSearch` | `setSearchInputValue` | `setIsLogoutPending` | etc...are all valid.
export type ActionTypes = keyof typeof actions

// Instead of maintaining a separate list of Redux Action Types, we can use the keys of our `actions`
// object above as our action types. That's what `stringEnum` does.
//
// Its type is being asserted as you can see so that when you try to access a key that doesn't exist
// on the `actions` object, you'll get a compile error.
export const ActionTypes = stringEnum(Object.keys(actions)) as {[name in ActionTypes]: ActionTypes}
