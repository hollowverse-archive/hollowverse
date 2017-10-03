import { css } from 'aphrodite/no-important';
import * as React from 'react';
import { connect } from 'react-redux';
import { toggleWarning } from 'store/features/ui/actions';
import { StoreState } from 'store/types';
import pick from 'lodash/pick';
import { styles } from './warning.styles';

interface Props {
  displayWarning: boolean;
}

function mapStateToProps(state: StoreState): Props {
  return pick(state, ['displayWarning']);
}

const actionCreators = {
  toggleWarning,
};

type ActionCreators = typeof actionCreators;

/** An alert box */
class WarningClass extends React.PureComponent<ActionCreators & Props, {}> {
  handleClick = () => {
    this.props.toggleWarning(false);
  };

  render() {
    const { displayWarning } = this.props;
    if (displayWarning) {
      return (
        <div className={css(styles.warningBar)}>
          <p className={css(styles.warningMessage)}>
            You are viewing a beta version of Hollowverse.
          </p>
          <i
            className={`fa fa-times ${css(styles.closeButton)}`}
            role="button"
            onClick={this.handleClick}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

export const Warning = connect(mapStateToProps, actionCreators)(WarningClass);
