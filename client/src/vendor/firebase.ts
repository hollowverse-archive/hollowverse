import * as firebase from 'firebase';
import { User } from 'typings/typeDefinitions';
import { makeError } from 'utils/utils';

const firebaseConfig = {
  apiKey: 'AIzaSyDeZnov5HXrnlYKwvyUYlnoiwTDYljpz5U',
  authDomain: 'hollowverse-c9cad.firebaseapp.com',
  databaseURL: 'https://hollowverse-c9cad.firebaseio.com',
  storageBucket: 'hollowverse-c9cad.appspot.com',
  messagingSenderId: '127114883987',
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();

export function login(
  payload: facebookSdk.AuthResponse,
): Promise<firebase.User> {
  try {
    const credential = firebase.auth.FacebookAuthProvider.credential(
      payload.authResponse.accessToken,
    );

    return firebaseAuth.signInWithCredential(credential) as Promise<
      firebase.User
    >;
  } catch (err) {
    throw makeError('facebookLoginError');
  }
}

export function logout() {
  return firebaseAuth.signOut();
}

export async function userExists(user: firebase.User) {
  const usersReference = firebaseDb.ref('users');
  const userSnapshot = await usersReference.child(user.uid).once('value');

  return userSnapshot.val() !== null;
}

export function createUser(user: User) {
  const usersReference = firebaseDb.ref('users');

  return usersReference.child(user.id).set({
    displayName: user.displayName,
  });
}

export async function loginOrRegister(
  facebookAuthResponse: facebookSdk.AuthResponse,
): Promise<void> {
  if (facebookAuthResponse.status === 'connected') {
    const firebaseUser = await login(facebookAuthResponse);
    const doesExist = await userExists(firebaseUser);

    if (!doesExist) {
      return createUser({
        displayName: firebaseUser.displayName,
        id: firebaseUser.uid,
      });
    } else {
      return undefined;
    }
  } else {
    throw makeError('firebaseLoginError');
  }
}

export async function getData(
  child: string,
): Promise<firebase.database.DataSnapshot | void> {
  const ref = firebaseDb.ref().child(child);
  const response = await ref.once('value');

  return response.val();
}
