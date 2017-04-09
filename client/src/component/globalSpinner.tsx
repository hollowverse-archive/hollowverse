import * as React from 'react'
import {connect} from 'react-redux'
import {State} from '../redux/reducers'
import * as selectors from '../redux/selectors'
import {FadeIn} from './animations'

import {cn} from '../utils/utils'

interface Props {
  showGlobalSpinner: boolean
}

class UnconnectedGlobalSpinner extends React.Component<Props, undefined> {
  container: HTMLDivElement

  cssClasses = {
    componentGlobalSpinner: 'componentGlobalSpinner modal',
    container: 'container',
    spinner: 'mdl-spinner mdl-js-spinner is-active',
  }

  render() {
    const {props: p, cssClasses: cc} = this
    const activeCssClass = (p.showGlobalSpinner) ? 'is-active' : ''

    return (
      <FadeIn timeout={300}>
        {p.showGlobalSpinner && (
          <div className={cn(cc.componentGlobalSpinner, activeCssClass)}>
            <div className='modal-background'></div>
            <div className='modal-content'>
              <div className='hero-body'>
                <div className='container has-text-centered'>
                  <div className='spinner'>
                    <div className='bounce1'></div>
                    <div className='bounce2'></div>
                    <div className='bounce3'></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </FadeIn>
    )
  }
}

export const GlobalSpinner = connect((state: State) => {
  return {
    showGlobalSpinner: selectors.showGlobalSpinner(state),
  }
})(UnconnectedGlobalSpinner)
