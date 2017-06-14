import * as cn from 'classnames'
import {pick as _pick, sortBy as _sortBy} from 'lodash'

export function stringEnum<T extends string>(o: T[]): {[K in T]: K} {
  return o.reduce((res, key) => {
    res[key] = key

    return res
  }, Object.create(null))
}

export function pick<T, K extends keyof T>(object: T, predicate: K[]): {[NAME in K]: T[NAME]} {
  return _pick(object, predicate) as any
}

export function sortByDescending<T>(object: {[index: number]: T, length: number}, iteratee: string): T[] {
  return _sortBy(object, iteratee).reverse()
}

export function promisify(method: any) {
  return () => {
    return new Promise((resolve, reject) => {
      method((results: any, err: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }
}

export {cn}
