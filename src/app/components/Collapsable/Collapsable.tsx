import React from 'react';
import cc from 'classcat';

import { AppDependenciesContext } from 'appDependenciesContext';

import classes from './Collapsable.module.scss';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';

import dropdownIcon from 'icons/dropdown.svg';

type Props = {
  label: React.ReactNode;
  isOpen?: boolean;
  className?: string;
  onChange?(isOpen: boolean): void;
};

type State = {
  isOpen: boolean;
};

/**
 * Hides or shows its children, uses native browser `<input />`
 * Works even without JavaScript.
 *
 * Can work as a controlled or uncontrolled component
 * @see https://reactjs.org/docs/uncontrolled-components.html
 * @see https://reactjs.org/docs/forms.html#controlled-components
 */
export class Collapsable extends React.PureComponent<Props, State> {
  static defaultProps: Partial<Props> = {
    isOpen: false,
  };

  state: State = {
    isOpen: this.props.isOpen || false,
  };

  defaultOnChange = (isOpen: boolean) => {
    this.setState({ isOpen });
  };

  componentWillReceiveProps({ isOpen }: Props) {
    this.setState({ isOpen: isOpen || false });
  }

  handleChange = () => {
    const onChange = this.props.onChange || this.defaultOnChange;

    onChange(!this.state.isOpen);
  };

  render() {
    const { label, children, className } = this.props;
    const { isOpen } = this.state;

    return (
      <AppDependenciesContext.Consumer>
        {({ getUniqueId }) => {
          const id = getUniqueId();

          return (
            <div className={cc([classes.root, className])}>
              {/*
                * The input, label, and children container
                * all have to be siblings in order to hide the children with
                * pure CSS using the sibling selector like this:
                *
                * ```css
                * .input:not(:checked) ~ .children {
                *    display: none;
                * }
                * ```
                */}
              <input
                className={classes.input}
                type="checkbox"
                id={id}
                onChange={this.handleChange}
                checked={isOpen}
                aria-checked={isOpen}
              />
              <label className={classes.label} htmlFor={id}>
                {label}
                <SvgIcon size={8} className={classes.icon} {...dropdownIcon} />
              </label>
              <div className={classes.children}>{children}</div>
            </div>
          );
        }}
      </AppDependenciesContext.Consumer>
    );
  }
}
