import { css } from 'aphrodite/no-important';
import * as React from 'react';
import { connect } from 'react-redux';
import { actions } from 'store/actions';
import { State } from 'store/reducers';
import pick from 'lodash/pick';
import { styles } from './warning.styles';

interface IProps {
  displayWarning: boolean;
}

function mapStateToProps(state: State): IProps {
  return pick(state, ['displayWarning']);
}

const actionCreators = pick(actions, ['toggleWarning']);

type ActionCreators = typeof actionCreators;

class WarningClass extends React.PureComponent<ActionCreators & IProps, {}> {
  handleClick = () => {
    this.props.toggleWarning(false);
  };

  render() {
    const { props: p } = this;
    if (p.displayWarning) {
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
