//
// REDUX ACTION CREATORS
//
//
// This file contains:
// * Redux action creators
// * Redux action types
//
import {stringEnum} from '../utils/utils'
import {IAlgoliaSearchResults} from '../vendor/algolia'
import {HvError} from '../typeDefinitions'
import {push} from 'react-router-redux'

// This is the regular action type on Hollowverse. It contains a Redux Action Type and a payload.
export interface Action<PayloadType> { type: string, payload: PayloadType}

// These are all the actions that can be triggered from within the Hollowverse application
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

  // Redux Sagas triggers
  requestSearchResults: (payload: string) => ({type: 'requestSearchResults', payload}),
  requestLogin: () => ({type: 'requestLogin'}),
  requestLogout: () => ({type: 'requestLogout'}),
  requestUpdateLoginStatus: () => ({type: 'requestUpdateLoginStatus'}),
}

// `ActionTypes` is a TypeScript type 'string' of any key from the object `actions` above,
// so `navigateToSearch` | `setSearchInputValue` | `setIsLogoutPending` | etc...are all valid
// types of `ActionTypes`
export type ActionTypes = keyof typeof actions

// Instead of maintaining a separate list of Redux Action Types, we can use the keys of our `actions`
// object above as our action types. That's what `stringEnum` does.
//
// Its type is being asserted as you can see so that when you try to access a key that doesn't exist
// on the `actions` object, you'll get a compile error.
export const ActionTypes = stringEnum(Object.keys(actions)) as {[name in ActionTypes]: ActionTypes}
