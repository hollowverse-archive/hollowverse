/**
 * Creates a function that transforms an array of strings to a
 * sentence composed of the array's elements joined by a separator,
 * with the last element preceded by a possibly different separator.
 * @example ['moderators', 'contributors', 'editors'] => 'moderators, contributors and editors'
 */
export const arrayToSentence = (lastSeparator = ' and ', separator = ', ') => (
  accumulator = '',
  currentValue: string,
  currentIndex: number,
  array: string[],
) => {
  return (
    accumulator +
    (currentIndex < array.length - 1 ? separator : lastSeparator) +
    currentValue
  );
};
