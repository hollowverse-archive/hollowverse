declare module 'circular-dependency-plugin' {
  import { Compiler, Plugin } from 'webpack'

  interface ICircularDependencyPluginOptions {
    exclude?: RegExp
    failOnError?: boolean
  }

  class CircularDependencyPlugin implements Plugin {
    constructor(options?: ICircularDependencyPluginOptions)
    apply(compiler: Compiler): void
  }

  namespace CircularDependencyPlugin { }

  export = CircularDependencyPlugin
}
