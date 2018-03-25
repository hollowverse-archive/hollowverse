export const delay = async <T = undefined>(n = 3000, resolveValue?: T) => {
  return new Promise<T>(resolve => {
    setTimeout(() => {
      resolve(resolveValue);
    }, n);
  });
};
