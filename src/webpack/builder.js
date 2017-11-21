const webpack = require('webpack');

/**
 * A promisifed wrapper around Webpack's Node.js API to build multiple bundles
 * @param {Array} configs Array of webpack configurations
 * @return {Promise} Promise of Webpack stats object, rejects on build errors
 */
module.exports.build = configs =>
  new Promise((resolve, reject) => {
    webpack(configs).run((err, stats) => {
      if (err) {
        reject(err);

        return;
      }

      const info = stats.toJson();
      if (stats.hasErrors()) {
        reject(info.errors);

        return;
      }

      resolve(stats);
    });
  });
