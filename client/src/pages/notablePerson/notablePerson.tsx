import { css } from 'aphrodite/no-important';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { NotablePersonSchema } from 'common/types/dataSchema';
import { common } from 'common.styles';
import { requestNotablePerson } from 'store/features/notablePerson/actions';
import { StoreState as State } from 'store/types';
import { Events } from './events';
import { styles } from './notablePerson.styles';
import { ShadowComponent } from './shadowComponent';

interface StateProps {
  notablePerson: NotablePersonSchema | null;
}

function mapStateToProps(state: State): StateProps {
  return {
    notablePerson: state.notablePerson,
  };
}

const actionCreators = {
  requestNotablePerson,
};

type ActionCreators = typeof actionCreators;

type MergedProps = StateProps & ActionCreators;

type Match = {
  slug: string;
};

type IProps = MergedProps & RouteComponentProps<Match>;

class NotablePersonClass extends React.PureComponent<IProps, {}> {
  componentDidMount() {
    const { slug } = this.props.match.params;
    this.props.requestNotablePerson(slug);
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
      return labels.map(label =>
        <span className={css(styles.notablePersonLabel)} key={label}>
          {label}
        </span>,
      );
    } else {
      return undefined;
    }
  }
}

export const NotablePerson = connect<IProps, StateProps, ActionCreators>(
  mapStateToProps,
  actionCreators,
)(NotablePersonClass);
