import * as React from 'react'
import {RouteComponentProps} from 'react-router-dom'

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
      <div className='pageNotablePerson'>
        <div className='notablePersonTitleContainer columns is-mobile'>
          <div className='column is-4'>
            <img className='notablePersonPhoto' src={dummyData.notablePersonPictureUrl}/>
          </div>
          <div className='column is-8'>
            <h1 className='notablePersonTitle'>Religion, Politics, and ideas of...</h1>
          <h2 className='notablePersonName'>{dummyData.notablePersonName}</h2>
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
        <span className='notablePersonLabel tag is-warning' key={i}>
          {label}
        </span>,
      )
    )
  }
}

export const NotablePerson = NotablePersonClass
