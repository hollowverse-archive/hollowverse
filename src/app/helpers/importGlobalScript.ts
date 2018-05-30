import memoizePromise from 'p-memoize';

export const importGlobalScript = memoizePromise(async (url: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.onload = () => {
      resolve();
    };

    script.onerror = event => {
      document.body.removeChild(script);

      reject(event.error);
    };

    script.src = url;

    document.body.appendChild(script);
  });
});
