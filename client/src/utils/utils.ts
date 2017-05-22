import * as cn from 'classnames'
import {pick as _pick} from 'lodash'

export function stringEnum<T extends string>(o: T[]): {[K in T]: K} {
  return o.reduce((res, key) => {
    res[key] = key

    return res
  }, Object.create(null))
}

export function pick<T, K extends keyof T>(object: T, predicate: K[]): {[NAME in K]: T[NAME]} {
  return _pick(object, predicate) as any
}

export function isValidEmail(email: string): boolean {
  const emailPattern = /.+@.+\..+/
  return emailPattern.test(email)
}

export function hasSentence(message: string): boolean {
  const minLength = 19
  const replaceWithSpace = message.replace(/\s+/g, ' ')
  if (replaceWithSpace.length > minLength) {
    return true
  } else {
    return false
  }
}

export {cn}
