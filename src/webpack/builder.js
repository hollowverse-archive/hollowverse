const webpack = require('webpack');

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
