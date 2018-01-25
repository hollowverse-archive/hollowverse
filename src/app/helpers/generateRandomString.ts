export const generateRandomString = (length = 6) =>
  // tslint:disable-next-line:insecure-random
  Math.random()
    .toString(36)
    .substr(2, length);
