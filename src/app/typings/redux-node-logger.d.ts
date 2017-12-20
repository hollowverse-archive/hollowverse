declare module 'redux-node-logger' {
  import { Middleware } from 'redux';
  declare function createNodeLogger(options?: any): Middleware;
  export default createNodeLogger;
}
