/* eslint-disable import/no-extraneous-dependencies */
const { omit, remove } = require('lodash');

module.exports = function clownCallback(clownFs) {
  clownFs.editJson('package.json', json =>
    omit(
      json,
      'jest',
      'devDependencies["npm-run-all"]',
      'dependencies["@hollowverse/utils"]',
    ),
  );

  clownFs.editJson('.vscode/extensions.json', json => {
    remove(json.recommendations, value => value === 'eg2.tslint');
    return json;
  });

  // We don't need this here as we use a custom Babel config based
  // on target (server/client)
  clownFs.remove('.babelrc');
};
