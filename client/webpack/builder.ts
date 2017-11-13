import * as webpack from 'webpack';

export const build = (configs: webpack.Configuration[]) =>
  new Promise<webpack.Stats>((resolve, reject) => {
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
