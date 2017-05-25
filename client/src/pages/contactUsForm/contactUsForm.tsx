import * as React from 'react'
import {connect} from 'react-redux'
import {RouteComponentProps} from 'react-router-dom'
import {Input} from '../../components/input'
import {actions} from '../../redux/actions'
import {State} from '../../redux/reducers'
import {pick, isValidEmail, hasSentence} from '../../utils/utils'

interface IProps {
  emailInputValue: string,
  messageInputValue: string,
}

function mapStateToProps(state: State): IProps {
  return {
    ...pick(state, [
      'emailInputValue',
      'messageInputValue',
    ]),
  }
}

const actionCreators = pick(actions, [
  'setEmailInputValue',
  'setMessageInputValue',
  'requestSubmitFormValues',
])

type ActionCreators = typeof actionCreators
type ComponentProps = ActionCreators & IProps & RouteComponentProps<any>

class ContactUsFormClass extends React.Component<ComponentProps, undefined> {
  render() {
    return (
      <div>
        <Input />
      </div>
    )
  }
}

export const ContactUsForm = connect<IProps, ActionCreators, RouteComponentProps<any>>(
  mapStateToProps,
  actionCreators,
)(ContactUsFormClass)
