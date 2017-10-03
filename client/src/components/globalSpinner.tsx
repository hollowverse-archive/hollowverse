import { css } from 'aphrodite/no-important';
import * as React from 'react';
import { connect } from 'react-redux';
import { StoreState as State, DefaultDispatchProps } from 'store/types';
import * as selectors from 'store/selectors';
import { FadeIn } from './animations';
import { styles } from './globalSpinner.styles';

interface StateProps {
  showGlobalSpinner: boolean;
}

function mapStateToProps(state: State): StateProps {
  return {
    showGlobalSpinner: selectors.showGlobalSpinner(state),
  };
}

type IProps = StateProps & DefaultDispatchProps;

/** Used when loading data for a new page */
class GlobalSpinnerClass extends React.PureComponent<IProps, {}> {
  container: HTMLDivElement;

  render() {
    const { showGlobalSpinner } = this.props;

    return (
      <FadeIn timeout={300}>
        {showGlobalSpinner &&
          <div className={css(styles.globalSpinnerContainer)}>
            <div className={css(styles.globalSpinner)} />
          </div>}
      </FadeIn>
    );
  }
}

export const GlobalSpinner = connect(mapStateToProps)(GlobalSpinnerClass);
