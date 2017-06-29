import * as cn from 'classnames'
import sortBy from 'lodash/sortBy'

export function stringEnum<T extends string>(o: T[]): {[K in T]: K} {
  return o.reduce((res, key) => {
    res[key] = key

    return res
  }, Object.create(null))
}

export function sortByDescending<T>(object: {[index: number]: T, length: number}, iteratee: string): T[] {
  return sortBy(object, iteratee).reverse()
}

export {cn}
