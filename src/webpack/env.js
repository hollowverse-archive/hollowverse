const compact = require('lodash/compact');

exports.isTest = process.env.NODE_ENV === 'test';
exports.isProduction = process.env.NODE_ENV === 'production';
exports.isCi = Boolean(Number(process.env.CI));
exports.isDevelopment = process.env.NODE_ENV === 'development';
exports.isDev = exports.isDevelopment;
exports.isProd = exports.isProduction;
exports.isHot = Boolean(Number(process.env.HOT));
exports.isBrowser = !process && typeof window !== 'undefined';
exports.isPreact = Boolean(Number(process.env.PREACT));
exports.isReact = !exports.isPreact;
exports.isEs5 = Boolean(process.env.ES5);
exports.isEsNext = !exports.isEs5;
exports.isPerf = !Number(process.env.NO_PERF_CHECKS);
exports.shouldTypeCheck = !Number(process.env.NO_TYPE_CHECK);
exports.isDebug = Boolean(Number(process.env.DEBUG));

/**
 * @param condition {boolean}
 */
const createConditionalWithFallback = (
  condition,
  defaultFallback = undefined,
) => (/** @type {Array | object | string} */ p, fallback = defaultFallback) => {
  if (Array.isArray(p)) {
    return condition ? compact(p) : fallback || [];
  }
  return condition ? p : fallback;
};

exports.ifProd = createConditionalWithFallback(exports.isProd);
exports.ifHot = createConditionalWithFallback(exports.isHot);
exports.ifTest = createConditionalWithFallback(exports.isTest);
exports.ifDev = createConditionalWithFallback(exports.isDev);
exports.ifReact = createConditionalWithFallback(exports.isReact);
exports.ifPreact = createConditionalWithFallback(exports.isPreact);
exports.ifEs5 = createConditionalWithFallback(exports.isEs5);
exports.ifEsNext = createConditionalWithFallback(exports.isEsNext);
exports.ifCi = createConditionalWithFallback(exports.isCi);
exports.ifPerf = createConditionalWithFallback(exports.isPerf);
exports.ifDebug = createConditionalWithFallback(exports.isDebug);
