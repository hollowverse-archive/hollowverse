import { isPlainObject } from 'lodash';

export function isBodyValid(body: any) {
  return (
    isPlainObject(body) &&
    typeof body.type === 'string' &&
    isPlainObject(body.payload)
  );
}
