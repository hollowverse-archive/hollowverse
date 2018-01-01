import * as React from 'react';

import * as classes from './Collapsable.module.scss';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';

import dropdownIcon from 'assets/iconDropdown.svg';

import { generateUuid } from 'helpers/generateUuid';

type Props = {
  id?: string;
  label: React.ReactNode;
  isOpen?: boolean;
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

    onChange(!this.props.isOpen);
  };

  render() {
    const { label, children, id = generateUuid() } = this.props;
    const { isOpen } = this.state;

    return (
      <div className={classes.root}>
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
          aria-checked={String(isOpen)}
        />
        <label
          className={classes.label}
          // There seems to be an issue in Preact server side rendering where
          // the `htmlFor` attribute is passed as-is because when JS is disabled,
          // the generated server markup has `htmlfor` instead of `for` and the
          // collapsable component does not toggle when the label is clicked.
          //
          // Using `{...{ for: id }}` tricks TypeScript into ignoring the
          // "unknown" property `for`, since TS expects `htmlFor` instead.
          {...{ for: id }}
        >
          {label}
          <SvgIcon size={8} className={classes.icon} {...dropdownIcon} />
        </label>
        <div className={classes.children}>{children}</div>
      </div>
    );
  }
}
