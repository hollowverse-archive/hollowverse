declare module 'webpack-merge' {
  // tslint:disable-next-line no-implicit-dependencies
  import { Configuration } from 'webpack';
  function merge(...args: Configuration[]): Configuration;

  export = merge;
}
