export async function delay<T = undefined>(n = 3000, resolveValue?: T) {
  return new Promise<T>(resolve => {
    setTimeout(() => {
      resolve(resolveValue);
    }, n);
  });
}
