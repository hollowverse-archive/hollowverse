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

function mapStateToProps(state: State): IProps {
  return {
    showGlobalSpinner: selectors.showGlobalSpinner(state),
  }
}

class GlobalSpinnerClass extends React.Component<IProps, undefined> {
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

export const GlobalSpinner = connect(mapStateToProps)(GlobalSpinnerClass)
