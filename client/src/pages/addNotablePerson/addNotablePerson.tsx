import * as React from 'react'
import {connect} from 'react-redux'
import {State} from '../../redux/reducers'
import * as selectors from '../../redux/selectors'
import pick from 'lodash/pick'

interface IProps {
  createProfileUrlInputValue: string
}

function mapStateToProps(state: State): IProps {
  return {
    ...pick(state, [
      'createProfileUrlInputValue',
    ]),
  }
}

class AddNotablePersonClass extends React.Component<IProps, undefined> {
  render() {
    const {props: p} = this

    return (
      <div className='pageCreateProfile'>
        <section className='hero is-light overflowHidden elementSpacingTopHalf'>
          <div className='hero-body fontAwesomeBackgroundImageWrapper'>
            <div className='container fontAwesomeBackgroundImageInner'>
              <h1 className='title'>Admin</h1>

              <div className='field'>
                <p className='control has-icon'>
                  <input
                    className='input'
                    readOnly
                    type='text'
                    value={p.createProfileUrlInputValue}
                    onChange={({target: {value}}) => null}
                    placeholder='Profile URL'
                  />
                  <span className='icon is-small'>
                    <i className='fa fa-link'/>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export const AddNotablePerson = connect(
  mapStateToProps,
)(AddNotablePersonClass)
