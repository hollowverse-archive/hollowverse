import {put, takeEvery} from 'redux-saga/effects'
import {actions} from './redux.actions'
import {Action} from './redux.utils'
import {algoliaSearchIndex} from './vendor.algolia'
import * as facebook from './vendor.facebook'
import * as firebase from './vendor.firebase'

function* requestSearchResults(action: Action<string>) {
  try {
    yield put(actions.setIsSearchPending(true))

    const searchResults = yield algoliaSearchIndex.search(action.payload)

    yield put(actions.setSearchResults(searchResults))
  } catch (error) {
    yield put(actions.setSearchError(error))
  } finally {
    yield put(actions.setIsSearchPending(false))
  }
}

function* requestLogin() {
  try {
    yield put(actions.setIsLoginPending(true))

    const facebookAuthResponse = yield facebook.login()

    yield firebase.loginOrRegister(facebookAuthResponse)

    yield put(actions.setLoginStatus('connected'))
  } catch (error) {
    yield put(actions.setError(error))
  } finally {
    yield put(actions.setIsLoginPending(false))
  }
}

function* requestLogout() {
  try {
    yield put(actions.setIsLogoutPending(true))

    yield [
      facebook.logout(),
      firebase.logout()
    ]

    yield put(actions.setLoginStatus('unknown'))
  } catch (error) {
    yield put(actions.setError(error))
  } finally {
    yield put(actions.setIsLogoutPending(false))
  }
}

function* requestUpdateLoginStatus() {
  try {
    yield facebook.initSdk()

    const facebookAuthResponse = yield facebook.getLoginStatus()

    if (facebookAuthResponse.status === 'connected') {
      yield put(actions.setIsLoginPending(true))
      yield firebase.loginOrRegister(facebookAuthResponse)
      yield put(actions.setLoginStatus('connected'))
    }
  } catch(error) {
    yield put(actions.setError(error))
  } finally {
    yield put(actions.setIsLoginPending(false))
  }
}

function* sagas() {
  yield takeEvery("requestSearchResults", requestSearchResults);
  yield takeEvery("requestLogin", requestLogin);
  yield takeEvery("requestLogout", requestLogout);
  yield takeEvery("requestUpdateLoginStatus", requestUpdateLoginStatus);
}

export {sagas};
