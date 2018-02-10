// @ts-ignore
const requireTest = require.context('./__tests__', true, /\.tsx?$/);
requireTest.keys().forEach(requireTest);
