import { css } from 'aphrodite/no-important';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { INotablePersonSchema } from '../../../../typings/dataSchema';
import { common } from '../../common.styles';
import { requestNotablePerson } from '../../store/features/notablePerson/actions';
import { State } from '../../store/reducers';
import { Events } from './events';
import { styles } from './notablePerson.styles';
import { ShadowComponent } from './shadowComponent';

import { DefaultDispatchProps } from '../../store/types';

interface StateProps {
  notablePerson: INotablePersonSchema | undefined;
}

function mapStateToProps(state: State): StateProps {
  return {
    notablePerson: state.notablePerson,
  };
}

type MergedProps = StateProps & DefaultDispatchProps;

type IProps = MergedProps & RouteComponentProps<{}>;

class NotablePersonClass extends React.PureComponent<IProps, {}> {
  componentDidMount() {
    // TODO: We'll pass the route parameters to below function:
    requestNotablePerson('/notablePersons/np_48d700ee');
  }

  render() {
    if (this.props.notablePerson) {
      const { name, photoUrl, labels, events } = this.props.notablePerson;

      return (
        <div className={css(common.page)}>
          <div className={css(styles.notablePersonTitleContainer)}>
            <img
              className={css(styles.notablePersonPhoto)}
              width="150"
              height="150"
              src={photoUrl}
            />
            <div className={css(styles.notablePersonText)}>
              <h1 className={css(styles.notablePersonTitle)}>
                Religion, politics, and ideas of...
              </h1>
              <h2
                className={css(
                  common.titleTypography,
                  styles.notablePersonName,
                )}
              >
                {name}
              </h2>
              {this.renderLabels(labels)}
            </div>
          </div>
          <Events data={events} />
        </div>
      );
    } else {
      return <ShadowComponent />;
    }
  }

  renderLabels(labels: string[]) {
    if (labels && labels.length > 0) {
      return labels.map((label, i) =>
        <span className={css(styles.notablePersonLabel)} key={i}>
          {label}
        </span>,
      );
    } else {
      return undefined;
    }
  }
}

export const NotablePerson = connect<IProps, StateProps>(mapStateToProps)(
  NotablePersonClass,
);
