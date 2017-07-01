import { Dispatch } from 'react-redux';
import { Action } from 'redux';

type DefaultDispatchProp<S> = {
  dispatch: Dispatch<S>;
};

type Factory<P> = React.ComponentType<P> | React.StatelessComponent<P>;

/**
 * This is a module augmentation.
 * @see https://github.com/Microsoft/TypeScript-Handbook/blob/fa9e2be1024014fe923d44b1b69d315e8347e444/pages/Declaration%20Merging.md#module-augmentation
 */
declare module 'react-redux' {
  /**
   * An override for `react-redux`'s `connect()`.
   * Provides strict type checking and correctly removes connected props
   * from the wrapped component.
   * You have to pass at least the first to type parameters (`AllProps`, `StateProps`)
   * in order for TS to pick it up.
   */
  export function connect<
    AllProps,
    StateProps,
    DispatchProps = DefaultDispatchProp<State>,
    State = object
  >(
    mapStateToProps: (state: State) => StateProps,
    mapDispatchToProps?: (dispatch: Dispatch<State>) => DispatchProps,
  ): (
    component: Factory<AllProps>,
  ) => React.ComponentClass<
    Overwrite<AllProps, Partial<DispatchProps & StateProps>>
  >;
}
