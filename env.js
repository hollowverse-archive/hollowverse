const compact = require('lodash/compact');

exports.isTest = process.env.NODE_ENV === 'test';
exports.isProduction = process.env.NODE_ENV === 'production';
exports.isCi = Boolean(process.env.CI);
exports.isDevelopment =
  exports.isTest || process.env.NODE_ENV === 'development';
exports.isDev = exports.isDevelopment;
exports.isProd = exports.isProduction;
exports.isHot = Boolean(process.env.HOT);
exports.isBrowser = !process && typeof window !== 'undefined';
exports.isPreact = !process.env.REACT;
exports.isReact = !exports.isPreact;
exports.isEs5 = Boolean(process.env.ES5);
exports.isEsNext = !exports.isEs5;
exports.isPerf = !process.env.NO_PERF_CHECKS;
exports.shouldLint = !process.env.NO_LINT;
exports.shouldTypeCheck = !process.env.NO_TYPE_CHECK;

const createConditionalWithFallback = (
  condition,
  defaultFallback = undefined,
) => (p, fallback = defaultFallback) => {
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
exports.ifLint = createConditionalWithFallback(exports.shouldLint);
exports.ifEsNext = createConditionalWithFallback(exports.isEsNext);
exports.ifCi = createConditionalWithFallback(exports.isCi);
exports.ifPerf = createConditionalWithFallback(exports.isPerf);
