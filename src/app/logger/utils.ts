import { isPlainObject } from 'lodash';

import { LoggedAction } from './types';

export function isBodyValid(body: any): body is LoggedAction[] {
  return (
    Array.isArray(body) &&
    body.every(
      action => isPlainObject(action) && typeof action.type === 'string',
    )
  );
}
