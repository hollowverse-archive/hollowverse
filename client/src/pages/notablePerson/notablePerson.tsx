import * as React from 'react'
import {css} from 'aphrodite/no-important'
import {RouteComponentProps} from 'react-router-dom'
import {common} from '../../common.styles'
import {styles} from './notablePerson.styles'

interface Props {
  notablePersonName: string
  notablePersonPictureUrl: string
  notablePersonLabels: string[]
}

const dummyData: Props = {
  notablePersonName: 'Michael Jackson',
  notablePersonPictureUrl: 'http://lorempixel.com/150/150/',
  notablePersonLabels: [
    'Musician',
    'Non-Political',
    "Jehova's Witness",
  ],
}

/* Todo:
  - [x] Custom Styles
  - [x] Custom Labels
  - [ ] Second pass for design & code optimization
*/

type ComponentProps = Props & RouteComponentProps<any>

class NotablePersonClass extends React.Component<ComponentProps, undefined> {
  render() {
    return (
      <div className={css(common.page)}>
        <div className={css(styles.notablePersonTitleContainer)}>
          <img className={css(styles.notablePersonPhoto)} src={dummyData.notablePersonPictureUrl}/>
          <div className={css(styles.notablePersonText)}>
            <h1 className={css(styles.notablePersonTitle)}>Religion, politics, and ideas of...</h1>
            <h2 className={css(common.titleTypography, styles.notablePersonName)}>{dummyData.notablePersonName}</h2>
            {this.renderLabels()}
          </div>
        </div>
      </div>
    )
  }
  renderLabels() {
    const { notablePersonLabels } = dummyData
    return (
      notablePersonLabels.map((label, i) =>
        <span className={css(styles.notablePersonLabel)} key={i}>
          {label}
        </span>,
      )
    )
  }
}

export const NotablePerson = NotablePersonClass
