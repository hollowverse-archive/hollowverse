import * as firebase from 'firebase'
import {IUser} from '../../../typings/typeDefinitions'
import {errors} from '../constants/errors'

const firebaseConfig = {
  apiKey: 'AIzaSyDeZnov5HXrnlYKwvyUYlnoiwTDYljpz5U',
  authDomain: 'hollowverse-c9cad.firebaseapp.com',
  databaseURL: 'https://hollowverse-c9cad.firebaseio.com',
  storageBucket: 'hollowverse-c9cad.appspot.com',
  messagingSenderId: '127114883987',
}

export const firebaseApp = firebase.initializeApp(firebaseConfig)
export const firebaseAuth = firebaseApp.auth()
export const firebaseDb = firebaseApp.database()

export function login(payload: facebookSdk.IAuthResponse): Promise<firebase.User> {
  return new Promise<firebase.User>((resolve) => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((firebaseUser: firebase.User) => {
      unsubscribe()

      resolve(firebaseUser)
    })
  })
    .then<firebase.User>(() => {
      const credential = firebase.auth.FacebookAuthProvider.credential(payload.authResponse.accessToken)

      return firebaseAuth.signInWithCredential(credential)
    })
    .catch(() => {
      return Promise.reject(errors.firebaseLoginError)
    })
}

export function logout() {
  return firebaseAuth.signOut()
}

export function userExists(user: firebase.User) {
  const usersReference = firebaseDb.ref('users')

  return new Promise<boolean>((resolve, reject) => {
    return usersReference.child(user.uid).once(
      'value',

      (snapshot) => {
        resolve(snapshot.val() !== null)
      },

      (error: firebase.FirebaseError) => {
        reject(error)
      },
    )
  })
}

export function createUser(user: IUser) {
  const usersReference = firebaseDb.ref('users')

  return usersReference.child(user.id).set({
    displayName: user.displayName,
  })
}

export function loginOrRegister(facebookAuthResponse: facebookSdk.IAuthResponse): Promise<void> {
  if (facebookAuthResponse.status === 'connected') {
    return login(facebookAuthResponse)
      .then<[boolean, firebase.User]>((firebaseUser) => {
        return Promise.all([userExists(firebaseUser), firebaseUser])
      })
      .then<void | undefined>((results) => {
        const [userExists, firebaseUser] = results

        if (!userExists) {
          return createUser({ displayName: firebaseUser.displayName, id: firebaseUser.uid })
        } else {
          return undefined
        }
      })
  } else {
    return Promise.reject(errors.firebaseLoginError)
  }
}

export async function getData(child: string): Promise<firebase.database.DataSnapshot | void> {
  try {
    const ref = firebaseDb.ref().child(child)
    const response = await ref.once('value')
    return response.val()
  } catch (err) {
    throw err
  }
}
