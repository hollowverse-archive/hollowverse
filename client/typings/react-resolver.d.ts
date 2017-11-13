declare module 'react-resolver' {
  import { ComponentClass, StatelessComponent, Factory } from 'react';
  type AnyComponent<P> = ComponentClass<P> | StatelessComponent<P>;

  export class Resolver {
    static async resolve<P, D>(
      factory: Factory<P>,
    ): Promise<{
      data: D;
      Resolved: StatelessComponent<P>;
    }>;

    static render<P>(factory: Factory<P>, root: Node | null): void;
  }

  type ResolveFn<Props, V> = (props: Props) => Promise<V>;

  /** Use this for gaining access to a context as a prop without the boilerplate of setting `contextTypes`. */
  export function context<K, V = any>(
    prop: K,
  ): <OwnProps>(
    component: AnyComponent<OwnProps>,
  ) => StatelessComponent<OwnProps & Record<typeof prop, V>>;

  export function resolve<
    OwnProps,
    K extends string,
    V,
    MoreProps = { [x: string]: any }
  >(
    prop: K,
    resolveFn: ResolveFn<OwnProps & MoreProps, V>,
  ): (
    component: AnyComponent<OwnProps & { [K]?: V }>,
  ) => StatelessComponent<OwnProps & MoreProps>;
  export function resolve<
    OwnProps,
    ResolvableProps = { [x: string]: any },
    MoreProps = { [x: string]: any }
  >(
    resolversMap: {
      [K in keyof ResolvableProps]: ResolveFn<
        OwnProps & MoreProps,
        ResolvableProps[K]
      >
    },
  ): (
    component: AnyComponent<OwnProps & { [K]?: V }>,
  ) => StatelessComponent<OwnProps & MoreProps>;
}
