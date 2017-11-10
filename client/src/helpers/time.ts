export const delay = async (n = 3000, resolveValue?: any) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(resolveValue);
    }, n);
  });
};
