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
