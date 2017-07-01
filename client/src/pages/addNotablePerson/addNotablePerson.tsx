import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../store/reducers';
import pick from 'lodash/pick';

import { DefaultDispatchProps } from '../../store/types';

interface StateProps {
  createProfileUrlInputValue: string;
}

function mapStateToProps(state: State): StateProps {
  return {
    ...pick(state, ['createProfileUrlInputValue']),
  };
}

type Props = StateProps & DefaultDispatchProps;

class AddNotablePersonClass extends React.PureComponent<Props, {}> {
  render() {
    const { props: p } = this;

    return (
      <div className="pageCreateProfile">
        <section className="hero is-light overflowHidden elementSpacingTopHalf">
          <div className="hero-body fontAwesomeBackgroundImageWrapper">
            <div className="container fontAwesomeBackgroundImageInner">
              <h1 className="title">Admin</h1>

              <div className="field">
                <p className="control has-icon">
                  <input
                    className="input"
                    readOnly
                    type="text"
                    value={p.createProfileUrlInputValue}
                    placeholder="Profile URL"
                  />
                  <span className="icon is-small">
                    <i className="fa fa-link" />
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export const AddNotablePerson = connect(mapStateToProps)(AddNotablePersonClass);
