const alreadyLoaded = new Set<string>();

export function importGlobalScript(url: string) {
  return new Promise((resolve, reject) => {
    if (alreadyLoaded.has(url)) {
      return resolve();
    }

    const script = document.createElement('script');
    script.onload = resolve;
    script.onerror = event => reject(event.error);
    script.src = url;

    document.body.appendChild(script);
  });
}
