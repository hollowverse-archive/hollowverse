const isAlreadyLoaded = (url: string) => {
  return document.querySelector(`script[src="${url}"]`) !== null;
};

export async function importGlobalScript(url: string) {
  return new Promise((resolve, reject) => {
    if (isAlreadyLoaded(url)) {
      resolve();

      return;
    }

    const script = document.createElement('script');
    script.onload = () => {
      resolve();
    };
    script.onerror = event => {
      reject(event.error);
    };
    script.src = url;

    document.body.appendChild(script);
  });
}
