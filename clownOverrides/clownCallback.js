const path = require('path');

module.exports = function clownCallback(clownFs) {
  const packageJsonPath = Object.keys(clownFs.fileContents).find(
    key => path.basename(key) === 'package.json',
  );

  /* eslint-disable no-param-reassign */
  clownFs.editJson(packageJsonPath, json => {
    delete json.jest;
    delete json.devDependencies['npm-run-all'];

    return json;
  });
};
