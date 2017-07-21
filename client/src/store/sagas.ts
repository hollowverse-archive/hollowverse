//
// REDUX SAGAS
//
// This file just contains Redux Sagas generators. For more information on Redux Sagas, see:
// https://github.com/redux-saga/redux-saga
//
import { put, takeEvery } from 'redux-saga/effects';
import { algoliaSearchIndex } from 'vendor/algolia';
import * as facebook from 'vendor/facebook';
import * as firebase from 'vendor/firebase';
import { fetchNotablePersonDataBySlug } from 'api';
import { Action } from 'store/types';
import {
  setIsSearchPending,
  setSearchResults,
  setSearchError,
} from 'store/features/search/actions';
import {
  setIsLoginPending,
  setLoginStatus,
  setIsLogoutPending,
  setUserData,
} from 'store/features/auth/actions';
import { setNotablePerson } from 'store/features/notablePerson/actions';
import { setError } from 'store/features/ui/actions';

// These are the Redux actions that trigger the saga generators
function* sagas() {
  yield takeEvery('requestSearchResults', requestSearchResults);
  yield takeEvery('requestLogin', requestLogin);
  yield takeEvery('requestLogout', requestLogout);
  yield takeEvery('requestUpdateLoginStatus', requestUpdateLoginStatus);
  yield takeEvery('requestNotablePerson', requestNotablePerson);
  yield takeEvery('requestUserData', requestUserData);
}

function* requestSearchResults(action: Action<'requestSearchResults'>) {
  try {
    yield put(setIsSearchPending(true));
    const searchResults = yield algoliaSearchIndex.search(action.payload);
    yield put(setSearchResults(searchResults));
  } catch (error) {
    yield put(setSearchError(error));
  } finally {
    yield put(setIsSearchPending(false));
  }
}

function* requestLogin() {
  try {
    yield put(setIsLoginPending(true));

    const facebookAuthResponse = yield facebook.login();

    yield firebase.loginOrRegister(facebookAuthResponse);

    yield put(setLoginStatus('connected'));
  } catch (error) {
    yield put(setError(error));
  } finally {
    yield put(setIsLoginPending(false));
  }
}

function* requestLogout() {
  try {
    yield put(setIsLogoutPending(true));

    yield [facebook.logout(), firebase.logout()];

    yield put(setLoginStatus('unknown'));
  } catch (error) {
    yield put(setError(error));
  } finally {
    yield put(setIsLogoutPending(false));
  }
}

function* requestUpdateLoginStatus() {
  try {
    yield facebook.initSdk();

    const facebookAuthResponse = yield facebook.getLoginStatus();

    if (facebookAuthResponse.status === 'connected') {
      yield put(setIsLoginPending(true));
      yield firebase.loginOrRegister(facebookAuthResponse);
      yield put(setLoginStatus('connected'));
    }
  } catch (error) {
    yield put(setError(error));
  } finally {
    yield put(setIsLoginPending(false));
  }
}

function* requestNotablePerson(action: Action<'requestNotablePerson'>) {
  try {
    const slug = action.payload;
    const response = yield fetchNotablePersonDataBySlug(slug);

    yield put(setNotablePerson(response));
  } catch (error) {
    throw error;
  }
}

function* requestUserData(action: Action<'requestUserData'>) {
  try {
    const firebaseResponse = yield firebase.getData(`/users/${action.payload}`);
    yield put(setUserData(firebaseResponse));
  } catch (error) {
    throw error;
  }
}

export { sagas };
