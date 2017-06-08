import {css} from 'aphrodite/no-important'
import * as React from 'react'
import {connect} from 'react-redux'
import {RouteComponentProps} from 'react-router-dom'
import {IContactFormData} from '../../../../typings/typeDefinitions'
import {common} from '../../common.styles'
import {Form} from '../../components/form'
import {Input} from '../../components/input'
import {actions} from '../../redux/actions'
import {State} from '../../redux/reducers'
import {hasName, hasSentence, isValidEmail, pick} from '../../utils/utils'
import {styles} from './contactUsForm.styles'

interface IProps {
  emailInputValue: string,
  nameInputValue: string,
  messageInputValue: string,
}

function mapStateToProps(state: State): IProps {
  return {
    ...pick(state, [
      'emailInputValue',
      'nameInputValue',
      'messageInputValue',
    ]),
  }
}

const actionCreators = pick(actions, [
  'setEmailInputValue',
  'setNameInputValue',
  'setMessageInputValue',
  'requestSubmitFormValues',
])

type ActionCreators = typeof actionCreators
type ComponentProps = ActionCreators & IProps & RouteComponentProps<any>

class ContactUsFormClass extends React.Component<ComponentProps, undefined> {
  render() {
    const {props: p} = this
    return (
      <div className={css(styles.pageContactForm)}>
        <div className={css(styles.formContainer)}>
          <h1 className={css(common.titleTypography, styles.formTitle)}>Contact us</h1>
          <Form onSubmit={() => this.handleFormSubmit()} noValidate>
            <label className={css(common.textTypography, styles.contactForm)}>Email:</label>
            <Input
              className={css(common.textTypography, styles.formInput)}
              type='email'
              value={p.emailInputValue}
              onTextChange={(value) => this.handleEmailInputChange(value)}
            />
            <label className={css(common.textTypography, styles.contactForm)}>Name:</label>
            <Input
              className={css(common.textTypography, styles.formInput)}
              type='text'
              value={p.nameInputValue}
              onTextChange={(value) => this.handleNameInputChange(value)}
            />
            <label className={css(common.textTypography, styles.contactForm)}>Message:</label>
            <textarea
              className={css(common.textTypography, styles.formInput, styles.textArea)}
              value={p.messageInputValue}
              onChange={({target: {value}}) => this.handleMessageInputChange(value)}
            />
            <div className={css(styles.submitButtonContainer)}>
              <input
                className={css(common.textTypography, common.palette, styles.submitButton)}
                disabled={!isValidEmail(p.emailInputValue) || !hasName(p.nameInputValue) || !hasSentence(p.messageInputValue)}
                type='submit'
                value='Send'
              />
            </div>
          </Form>
        </div>
      </div>
    )
  }

  handleEmailInputChange(emailText: string) {
    const {props: p} = this
    p.setEmailInputValue(emailText)
  }

  handleNameInputChange(nameText: string) {
    const {props: p} = this
    p.setNameInputValue(nameText)
  }

  handleMessageInputChange(messageText: string) {
    const {props: p} = this
    p.setMessageInputValue(messageText)
  }

  handleFormSubmit() {
    const {props: p} = this
    this.submitValuesAction({
      email: p.emailInputValue,
      name: p.nameInputValue,
      message: p.messageInputValue,
    })
    p.setEmailInputValue('')
    p.setNameInputValue('')
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
