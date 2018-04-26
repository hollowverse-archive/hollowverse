/* eslint-disable import/no-extraneous-dependencies */
const { omit } = require('lodash');

module.exports = function clownCallback(clownFs) {
  clownFs.editJson('package.json', json =>
    omit(
      json,
      'jest',
      'devDependencies["npm-run-all"]',
      'dependencies["@hollowverse/utils"]',
    ),
  );
};
