/**
 * @see https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/8809472#8809472
 */
export function generateUuid() {
  let d = new Date().getTime();

  if ('performance' in global && typeof performance.now === 'function') {
    d += performance.now();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // tslint:disable-next-line:no-bitwise insecure-random
    const r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);

    // tslint:disable-next-line:no-bitwise
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
