import * as React from 'react'
import {connect} from 'react-redux'
import {RouteComponentProps} from 'react-router-dom'
import {actions} from '../redux/actions'
import {State} from '../redux/reducers'
import {hasSentence, isValidEmail, pick} from '../utils/utils'

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

class InputClass extends React.Component<ComponentProps, undefined> {
  render() {
    const {props: p} = this

    return (
      <div>
        <h1>Contact Us</h1>
          <p>
            <input
              placeholder='Your Email'
              type='email'
              value={p.emailInputValue}
              onChange={({target: {value}}) => this.handleEmailInputChange(value)}
            />
          </p>
          <p>
            <textarea
              placeholder='Your Message'
              value={p.messageInputValue}
              onChange={({target: {value}}) => this.handleMessageInputChange(value)}
            />
          </p>
          <input
            disabled={!isValidEmail(p.emailInputValue) || !hasSentence(p.messageInputValue)}
            type='submit'
            value='Submit'
          />
      </div>
    )
  }

  handleEmailInputChange(emailText: string) {
    const {props: p} = this
    p.setEmailInputValue(emailText)
  }

  handleMessageInputChange(messageText: string) {
    const {props: p} = this
    p.setMessageInputValue(messageText)
  }
}

export const Input = connect(mapStateToProps, actionCreators)(InputClass)
