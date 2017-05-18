import * as React from 'react'
import {connect} from 'react-redux'
import {RouteComponentProps} from 'react-router-dom'
import {actions} from '../../redux/actions'
import {State} from '../../redux/reducers'
import {pick} from '../../utils/utils'

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
])

type ActionCreators = typeof actionCreators
type ComponentProps = ActionCreators & IProps & RouteComponentProps<any>

class ContactUsFormClass extends React.Component<ComponentProps, undefined> {
  render() {
    const {props: p} = this

    return (
      <div>
        <h1>Contact Us</h1>
        <form>
          <label>
            <input
              placeholder='Your Email'
              type='email'
              id='mail'
              name='emailAddress'
              value={p.emailInputValue}
              onChange={({target: {value}}) => this.handleEmailInputChange(value)}
            />
          </label>
          <label>
            <textarea
              placeholder='Your Message'
              id='message'
              name='userMessage'
              value={p.messageInputValue}
              onChange={({target: {value}}) => this.handleMessageInputChange(value)}
              >
            </textarea>
          </label>
          <input
            type='submit'
            value='Submit'
          />
        </form>
      </div>
    )
  }

  handleEmailInputChange(emailText: string) {
    console.log(this.props.setEmailInputValue(emailText))
  }

  handleMessageInputChange(messageText: string) {
    console.log(this.props.setMessageInputValue(messageText))
  }

}

export const ContactUsForm = connect<IProps, ActionCreators, RouteComponentProps<any>>(
  mapStateToProps,
  actionCreators,
)(ContactUsFormClass)
