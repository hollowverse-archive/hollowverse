declare module 'circular-dependency-plugin' {
  import { Compiler, Plugin } from 'webpack'

  interface CircularDependencyPluginOptions {
    exclude?: RegExp
    failOnError?: boolean
  }

  class CircularDependencyPlugin implements Plugin {
    constructor(options?: CircularDependencyPluginOptions)
    apply(compiler: Compiler): void
  }

  namespace CircularDependencyPlugin { }

  export = CircularDependencyPlugin
}
