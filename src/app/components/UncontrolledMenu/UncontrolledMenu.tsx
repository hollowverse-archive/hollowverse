import React from 'react';
import { ButtonProps } from '@material-ui/core/Button';
import { LocationAwareMenu } from 'components/LocationAwareMenu/LocationAwareMenu';
import { MenuProps } from '@material-ui/core/Menu';

type State = {
  anchorEl: HTMLElement | null;
};

export type UncontrolledMenuItemProps = {
  onClick(): void;
};

type Props = {
  id: string;
  renderButton(props: any): JSX.Element;
  children(props: UncontrolledMenuItemProps): React.ReactNode;
} & Pick<MenuProps, 'anchorOrigin'>;

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
          onClick: this.handleClick,
        })}
        {anchorEl ? (
          <LocationAwareMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            id={id}
            onClose={this.handleClose}
            getContentAnchorEl={undefined}
          >
            {children({ onClick: this.handleClose })}
          </LocationAwareMenu>
        ) : null}
      </>
    );
  }
}
