export const arrayToSentence = (lastSeparator = ' and ', separator = ', ') => (
  acc = '',
  value: string,
  i: number,
  array: string[],
) => {
  return acc + (i < array.length - 1 ? separator : lastSeparator) + value;
};
