import * as cn from 'classnames';
import sortBy from 'lodash/sortBy';

export function stringEnum<T extends string>(o: T[]): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;

    return res;
  }, Object.create(null));
}

export function sortByDescending<T>(
  object: { [index: number]: T; length: number },
  iteratee: string,
): T[] {
  return sortBy(object, iteratee).reverse();
}

export function isValidEmail(email: string): boolean {
  const emailPattern = /.+@.+\..+/;

  return emailPattern.test(email);
}

export function hasSentence(message: string): boolean {
  const minLength = 19;
  const replaceWithSpace = message.replace(/\s+/g, ' ');

  if (replaceWithSpace.length > minLength) {
    return true;
  } else {
    return false;
  }
}

export function hasName(name: string): boolean {
  const nameCharacter = name.charAt(0);
  const namePattern = /[^-_$!"\()[\]{}?+=%^&*:@~#';/,.<>\\|`\s]/g;

  return namePattern.test(nameCharacter);
}

export { cn };
