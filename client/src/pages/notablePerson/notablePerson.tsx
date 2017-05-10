import * as React from 'react'
import {css} from 'aphrodite/no-important'
import {RouteComponentProps} from 'react-router-dom'
import {common} from '../../common.styles'
import {styles} from './notablePerson.styles'

interface Props {
  notablePersonName: string
  notablePersonPictureUrl: string
  notablePersonLabels: [string]
}

const dummyData: Props = {
  notablePersonName: 'Micheal Jackson',
  notablePersonPictureUrl: 'http://lorempixel.com/150/150/',
  notablePersonLabels: [
    'Musician',
    'Non-Political',
    "Jehova's Witness",
  ],
}

type ComponentProps = Props & RouteComponentProps<any>

class NotablePersonClass extends React.Component<ComponentProps, undefined> {
  render() {
    return (
      <div className={css(styles.pageNotablePerson)}>
        <div className={css(styles.notablePersonTitleContainer)}>
          <img className={css(styles.notablePersonPhoto)} src={dummyData.notablePersonPictureUrl} />
        </div>
        <h1 className={css(styles.notablePersonTitle)}>Religion, Politics, and ideas of...</h1>
        <h2 className={css(styles.notablePersonName)}>{dummyData.notablePersonName}</h2>
        {this.renderLabels()}
      </div>
    )
  }
  renderLabels() {
    const { notablePersonLabels } = dummyData
    return (
      notablePersonLabels.map((label, i) =>
        <span className='notablePersonLabel tag is-warning' key={i}>
          {label}
        </span>,
      )
    )
  }
}

export const NotablePerson = NotablePersonClass
