import * as React from 'react'
import {connect} from 'react-redux'
import {RouteComponentProps} from 'react-router-dom'
import {IContactFormData} from '../../../typings/typeDefinitions'
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
        <form onSubmit={(event) => this.handleFormSubmit(event)} noValidate>
          <label>
            <input
              placeholder='Your Email'
              type='email'
              value={p.emailInputValue}
              onChange={({target: {value}}) => this.handleEmailInputChange(value)}
            />
          </label>
          <label>
            <textarea
              placeholder='Your Message'
              value={p.messageInputValue}
              onChange={({target: {value}}) => this.handleMessageInputChange(value)}
              >
            </textarea>
          </label>
          <input
            disabled={!isValidEmail(p.emailInputValue) || !hasSentence(p.messageInputValue)}
            type='submit'
            value='Submit'
          />
        </form>
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

  handleFormSubmit(event: any) {
    const {props: p} = this
    event.preventDefault()
    this.submitValuesAction({email: p.emailInputValue, message: p.messageInputValue})
  }

  submitValuesAction(formValues: IContactFormData) {
    const {props: p} = this
    p.requestSubmitFormValues(formValues)
  }
}

export const Input = connect(mapStateToProps, actionCreators)(InputClass)
