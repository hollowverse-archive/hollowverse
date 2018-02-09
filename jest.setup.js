// @ts-nocheck
/* eslint-disable no-underscore-dangle */

const { globals } = require('./src/webpack/shared');

global.__IS_SERVER__ = false;

Object.entries(globals).forEach(([key, value]) => {
  global[key] = value;
});

process.on('unhandledRejection', e => {
  console.error(e);
});
