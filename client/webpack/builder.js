const webpack = require('webpack');

const build = configs =>
  new Promise((resolve, reject) => {
    webpack(configs).run((err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }

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

module.exports = build;
