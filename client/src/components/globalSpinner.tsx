import {css} from 'aphrodite/no-important'
import * as React from 'react'
import {connect} from 'react-redux'
import {State} from '../redux/reducers'
import * as selectors from '../redux/selectors'
import {FadeIn} from './animations'
import {styles} from './globalSpinner.styles'

interface IProps {
  showGlobalSpinner: boolean
}

class UnconnectedGlobalSpinner extends React.Component<IProps, undefined> {
  container: HTMLDivElement

  render() {
    const {props: p} = this

    return (
      <FadeIn timeout={300}>
        {p.showGlobalSpinner && (
          <div className={css(styles.globalSpinnerContainer)}>
            <div className={css(styles.globalSpinner)}/>
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
