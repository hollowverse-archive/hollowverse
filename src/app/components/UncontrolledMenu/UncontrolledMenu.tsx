import React from 'react';
import { ButtonProps } from '@material-ui/core/Button';
import { LocationAwareMenu } from 'components/LocationAwareMenu/LocationAwareMenu';

type State = {
  anchorEl: HTMLElement | null;
};

type ChildrenProps = {
  onClick(): void;
};

type Props = {
  id: string;
  renderButton(props: any): JSX.Element;
  children(props: ChildrenProps): React.ReactNode;
};

export class UncontrolledMenu extends React.Component<Props, State> {
  state = {
    anchorEl: null,
  };

  handleClick: ButtonProps['onClick'] = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { id, children, renderButton } = this.props;
    const { anchorEl } = this.state;

    return (
      <>
        {renderButton({
          'aria-haspopup': 'true',
          'aria-owns': anchorEl ? id : null,
        })}
        {anchorEl ? (
          <LocationAwareMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            id={id}
            onClose={this.handleClose}
          >
            {children({ onClick: this.handleClose })}
          </LocationAwareMenu>
        ) : null}
      </>
    );
  }
}
