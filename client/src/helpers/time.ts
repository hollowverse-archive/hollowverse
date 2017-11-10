export const delay = async (n = 3000, resolveValue?: any) =>
  new Promise(resolve => setTimeout(() => resolve(resolveValue), n));
