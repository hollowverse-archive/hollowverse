import { css } from 'aphrodite/no-important';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { INotablePersonSchema } from 'typings/dataSchema';
import { common } from 'common.styles';
import { requestNotablePerson } from 'store/features/notablePerson/actions';
import { State } from 'store/reducers';
import { Events } from './events';
import { styles } from './notablePerson.styles';
import { ShadowComponent } from './shadowComponent';

interface StateProps {
  notablePerson: INotablePersonSchema | null;
}

function mapStateToProps(state: State): StateProps {
  return {
    notablePerson: state.notablePerson,
  };
}

const actionCreators = {
  requestNotablePerson,
};

type MergedProps = StateProps & typeof actionCreators;

type Match = {
  id: string;
};

type IProps = MergedProps & RouteComponentProps<Match>;

class NotablePersonClass extends React.PureComponent<IProps, {}> {
  componentDidMount() {
    // tslint:disable-next-line no-suspicious-comment
    // TODO: We'll pass the route parameters to below function:
    this.props.requestNotablePerson('/notablePersons/np_48d700ee');
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
              alt={name}
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

export const NotablePerson = connect<IProps, StateProps, typeof actionCreators>(
  mapStateToProps,
  actionCreators,
)(NotablePersonClass);
