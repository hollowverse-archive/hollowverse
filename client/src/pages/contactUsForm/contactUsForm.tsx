import * as React from 'react'
import {connect} from 'react-redux'
import {RouteComponentProps} from 'react-router-dom'
import {IContactFormData} from '../../../../typings/typeDefinitions'
import {Form} from '../../components/form'
import {Input} from '../../components/input'
import {actions} from '../../redux/actions'
import {State} from '../../redux/reducers'
import {hasSentence, isValidEmail, pick} from '../../utils/utils'

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
    const {props: p} = this
    return (
      <div>
        <h1>Contact Us</h1>
        <Form onSubmit={() => this.handleFormSubmit()} noValidate>
         <p>
          <Input
            placeholder='Your Email'
            type='email'
            value={p.emailInputValue}
            onTextChange={(value) => this.handleEmailInputChange(value)}
          />
         </p>
         <p>
           <textarea
             placeholder='Your Message'
             value={p.messageInputValue}
             onChange={({target: {value}}) => this.handleMessageInputChange(value)}
           />
         </p>
         <p>
          <input
            disabled={!isValidEmail(p.emailInputValue) || !hasSentence(p.messageInputValue)}
            type='submit'
            value='Submit'
          />
         </p>
        </Form>
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

  handleFormSubmit() {
    const {props: p} = this
    this.submitValuesAction({email: p.emailInputValue, message: p.messageInputValue})
    p.setEmailInputValue('')
    p.setMessageInputValue('')
  }

  submitValuesAction(formValues: IContactFormData) {
    const {props: p} = this
    p.requestSubmitFormValues(formValues)
  }
}

export const ContactUsForm = connect<IProps, ActionCreators, RouteComponentProps<any>>(
  mapStateToProps,
  actionCreators,
)(ContactUsFormClass)
