// This mock works around lack of `window.scroll` support in Jest

/* eslint-disable strict */
module.exports.toggle = () => undefined;
module.exports.on = () => undefined;
module.exports.off = () => undefined;
