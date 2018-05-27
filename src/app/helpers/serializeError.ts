/**
 * `Error` objects are not serialized with `JSON.stringify` because
 * their properties are not enumerable. This small helper will destructure
 * the error object and return a normal object with enumerable properties
 * so that it can be serialized as JSON.
 */
export const serializeError = ({ name, message, stack }: Error) => ({
  name,
  message,
  stack,
});
