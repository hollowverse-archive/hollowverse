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
   * A better-typed variant of `react-redux`'s `connect()`.
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

  /**
   * A better-typed variant of `react-redux`'s `connect()` with the second argument
   * being an object of action creates that gets automatically bound to dispatch
   * and new bound functions are passed as props with same names as the object's keys.
   * You have to pass at least 3 type parameters (`AllProps`, `StateProps`, `ActionCreators`)
   * in order for TS to pick it up.
   */
  export function connect<AllProps, StateProps, ActionCreators, State = object>(
    mapStateToProps: (state: State) => StateProps,
    actionCreators?: ActionCreators,
  ): (
    component: Factory<AllProps>,
  ) => React.ComponentClass<
    Overwrite<AllProps, Partial<ActionCreators & StateProps>>
  >;
}
