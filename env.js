const compact = require('lodash/compact');

exports.isTest = process.env.NODE_ENV === 'test';
exports.isProduction = process.env.NODE_ENV === 'production';
exports.isCi = Boolean(Number(process.env.CI));
exports.isDevelopment =
  exports.isTest || process.env.NODE_ENV === 'development';
exports.isDev = exports.isDevelopment;
exports.isProd = exports.isProduction;
exports.isHot = Boolean(Number(process.env.HOT));
exports.isStats = Boolean(Number(process.env.STATS));
exports.isBrowser = !process && typeof window !== 'undefined';
exports.isReact = Boolean(Number(process.env.REACT));
exports.isPreact = !exports.isReact;
exports.isEs5 = Boolean(process.env.ES5);
exports.isEsNext = !exports.isEs5;
exports.isPerf = !Number(process.env.NO_PERF_CHECKS);
exports.shouldLint = !Number(process.env.NO_LINT);
exports.shouldTypeCheck = !Number(process.env.NO_TYPE_CHECK);

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
exports.ifStats = createConditionalWithFallback(exports.isStats);
