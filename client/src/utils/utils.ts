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
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailPattern.test(email)
}

export function hasSentence(message: string): boolean {
  const minLength = 19
  if (message.trim().length !== 0 && message.length > minLength) {
    return true
  } else {
    return false
  }
}

export {cn}
