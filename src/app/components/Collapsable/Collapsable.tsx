import * as React from 'react';

import * as classes from './Collapsable.module.scss';
import { random } from 'lodash';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';

import dropdownIcon from 'assets/iconDropdown.svg';

type Props = {
  id?: string;
  label: React.ReactNode;
  isOpen?: boolean;
  onChange?(isOpen: boolean): void;
};

type State = {
  isOpen: boolean;
};

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
    const { label, children, id = `Collapsable_${random()}` } = this.props;
    const { isOpen } = this.state;

    return (
      <div className={classes.root}>
        <input
          className={classes.input}
          type="checkbox"
          id={id}
          onChange={this.handleChange}
          checked={isOpen}
          aria-checked={Boolean(isOpen)}
        />
        <label className={classes.label} {...{ for: id }}>
          {label}
          <SvgIcon size={8} className={classes.icon} {...dropdownIcon} />
        </label>
        <div className={classes.children}>{children}</div>
      </div>
    );
  }
}
