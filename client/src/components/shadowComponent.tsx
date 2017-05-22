import {css} from 'aphrodite/no-important'
import * as React from 'react'
import {styles} from './shadowComponent.styles'
import {common} from '../common.styles'
import {styles as npStyles} from './../pages/notablePerson/notablePerson.styles'
import {styles as eventStyles} from './../pages/notablePerson/events.styles'

interface IProps {
  type: string
}

/* This component gets called from parent components like
  <ShadowComponent type="NotablePerson"/> in the loading path of conditional rendering logic.
*/

class ShadowComponentClass extends React.Component<IProps, undefined> {
  render() {
    const {type} = this.props

    return (
      this.renderRequestedShadowComponent(type)
    )
  }

  renderRequestedShadowComponent(type: string) {
    switch (type) {
      case 'NotablePerson':
        return this.renderShadowNotablePerson()
      default:
        return null
    }
  }

  renderShadowNotablePerson() {
    return (
      <div className={css(common.page)}>
        <div className={css(npStyles.notablePersonTitleContainer)}>
          <span className={css(styles.shadowPhoto)} />
          <div className={css(npStyles.notablePersonText)}>
            <h1 className={css(npStyles.notablePersonTitle)}>Religion, politics, and ideas of...</h1>
            <h1 className={css(common.titleTypography, npStyles.notablePersonName, styles.shadowName)} />
            <span className={css(npStyles.notablePersonLabel, styles.shadowLabels)} />
            <span className={css(npStyles.notablePersonLabel, styles.shadowLabels)} />
            <span className={css(npStyles.notablePersonLabel, styles.shadowLabels)} />
          </div>
        </div>
        {this.renderShadowNotablePersonEvents([1, 2, 3])}
      </div>
    )
  }
  renderShadowNotablePersonEvents(n: number[]) {
    return (
      n.map((f, i) =>
        <div key={i} className={css(eventStyles.eventContent, styles.shadowContainer)}>
          <span className={css(npStyles.notablePersonLabel, styles.shadowContent)} />
          <span className={css(npStyles.notablePersonLabel, styles.shadowContent, styles.shadowContentIndented)} />
          <span className={css(npStyles.notablePersonLabel, styles.shadowContent, styles.shadowContentIndented)} />
          <div className={css(eventStyles.userContainer)}>
            <span className={css(npStyles.notablePersonLabel, styles.shadowContent, styles.shadowUserContent)} />
          </div>
        </div>,
      )
    )
  }
}

export const ShadowComponent = ShadowComponentClass
