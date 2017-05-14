import * as React from 'react'
import {css} from 'aphrodite/no-important'
import {connect} from 'react-redux'
import {State} from '../redux/reducers'
import * as selectors from '../redux/selectors'
import {FadeIn} from './animations'
import {RouteComponentProps} from 'react-router-dom'
import {styles} from './globalSpinner.styles'

import {cn} from '../utils/utils'

interface Props {
  showGlobalSpinner: boolean
}

class UnconnectedGlobalSpinner extends React.Component<Props, undefined> {
  container: HTMLDivElement

  render() {
    const {props: p} = this

    return (
      <FadeIn timeout={300}>
        {p.showGlobalSpinner && (
          <div className={css(styles.globalSpinner)}>
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
