import { isPlainObject } from 'lodash';
import { Action } from 'store/types';

export function isBodyValid(body: any): body is Action[] {
  return (
    Array.isArray(body) &&
    body.every(
      action => isPlainObject(action) && typeof action.type === 'string',
    )
  );
}
