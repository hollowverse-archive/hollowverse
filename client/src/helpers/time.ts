export const delay = (n = 3000) =>
  new Promise(resolve => setTimeout(resolve, n));
