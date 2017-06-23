import {css} from 'aphrodite/no-important'
import * as React from 'react'
import {connect} from 'react-redux'
import {RouteComponentProps} from 'react-router-dom'
import {IContactFormData} from '../../../../typings/typeDefinitions'
import {common} from '../../common.styles'
import {Form} from '../../components/form'
import {GlobalSpinner} from '../../components/globalSpinner'
import {Input} from '../../components/input'
import {actions} from '../../redux/actions'
import {State} from '../../redux/reducers'
import {hasName, hasSentence, isValidEmail, pick} from '../../utils/utils'
import {styles} from './contactUsForm.styles'

interface IProps {
  emailHasBlur: boolean,
  nameHasBlur: boolean,
  messageHasBlur: boolean,
  emailInputValue: string,
  nameInputValue: string,
  messageInputValue: string,
  isSubmitPending: boolean,
  submitSuccess: boolean,
}

function mapStateToProps(state: State): IProps {
  return {
    ...pick(state, [
      'emailHasBlur',
      'nameHasBlur',
      'messageHasBlur',
      'emailInputValue',
      'nameInputValue',
      'messageInputValue',
      'isSubmitPending',
      'submitSuccess',
    ]),
  }
}

const actionCreators = pick(actions, [
  'setEmailHasBlur',
  'setNameHasBlur',
  'setMessageHasBlur',
  'setEmailInputValue',
  'setNameInputValue',
  'setMessageInputValue',
  'setIsSubmitPending',
  'setSubmitSuccess',
  'requestSubmitFormValues',
])

type ActionCreators = typeof actionCreators
type ComponentProps = ActionCreators & IProps & RouteComponentProps<any>

class ContactUsFormClass extends React.Component<ComponentProps, undefined> {
  render() {
    const {props: p} = this
    const emailInputValid = this.emailInputValidation()
    const nameInputValid = this.nameInputValidation()
    const messageInputValid = this.messageInputValidation()
    const submitSuccessTrue = this.submitSuccessValidation()

    return (
      <div className={css(styles.pageContactForm)}>
        <GlobalSpinner />
        {p.submitSuccess ? <div>Your message was sent successfully. We'll get back with you soon!</div> : ''}
        <div className={css(styles.formContainer, submitSuccessTrue)}>
          <h1 className={css(common.titleTypography, styles.formTitle)}>Contact us</h1>
          <Form onSubmit={() => this.handleFormSubmit()} noValidate>
            <label className={css(common.textTypography, styles.contactForm)}>Email:</label>
            <Input
              className={css(common.textTypography, styles.formInput, emailInputValid)}
              type='email'
              value={p.emailInputValue}
              onTextChange={(value) => this.handleEmailInputChange(value)}
              onBlur={(event) => this.onEmailBlur(event)}
            />
            <label className={css(common.textTypography, styles.contactForm)}>Name:</label>
            <Input
              className={css(common.textTypography, styles.formInput, nameInputValid)}
              type='text'
              value={p.nameInputValue}
              onTextChange={(value) => this.handleNameInputChange(value)}
              onBlur={(event) => this.onNameBlur(event)}
            />
            <label className={css(common.textTypography, styles.contactForm)}>Message:</label>
            <textarea
              className={css(common.textTypography, styles.formInput, styles.textArea, messageInputValid)}
              value={p.messageInputValue}
              onChange={({target: {value}}) => this.handleMessageInputChange(value)}
              onBlur={(event) => this.onMessageBlur(event)}
            />
            <div className={css(styles.submitButtonContainer)}>
              <input
                className={css(common.textTypography, common.palette, styles.submitButton)}
                disabled={
                  !isValidEmail(p.emailInputValue) ||
                  !hasName(p.nameInputValue) ||
                  !hasSentence(p.messageInputValue)
                  }
                type='submit'
                value='Send'
              />
            </div>
          </Form>
        </div>
      </div>
    )
  }

  onEmailBlur(event: any) {
    const {props: p} = this
    p.setEmailHasBlur(true)
  }

  onNameBlur(event: any) {
    const {props: p} = this
    p.setNameHasBlur(true)
  }

  onMessageBlur(event: any) {
    const {props: p} = this
    p.setMessageHasBlur(true)
  }

  emailInputValidation() {
    const {props: p} = this
    if (p.emailHasBlur === true) {
      return !isValidEmail(p.emailInputValue) ? styles.invalidInput : styles.validInput
    } else {
      return null
    }
  }

  nameInputValidation() {
    const {props: p} = this
    if (p.nameHasBlur === true) {
      return !hasName(p.nameInputValue) ? styles.invalidInput : styles.validInput
    } else {
      return null
    }
  }

  messageInputValidation() {
    const {props: p} = this
    if (p.messageHasBlur === true) {
      return !hasSentence(p.messageInputValue) ? styles.invalidInput : styles.validInput
    } else {
      return null
    }
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
    // this.onFormSubmit()
    // this.timeoutPlaceholder()
    // p.setIsSubmitPending(true)
    p.setEmailInputValue('')
    p.setNameInputValue('')
    p.setMessageInputValue('')
    p.setEmailHasBlur(false)
    p.setNameHasBlur(false)
    p.setMessageHasBlur(false)
  }

  // onFormSubmit() {
  //   fetch('https://jsonplaceholder.typicode.com/posts/1').then((response) => {
  //     const {props: p} = this
  //     if (response.ok) {
  //       p.setIsSubmitPending(false)
  //       p.setSubmitSuccess(true)
  //     }
  //   }).catch((error) => {
  //     alert(error)
  //   })
  // }

  submitSuccessValidation() {
    if (this.props.submitSuccess === true) {
      return styles.hide
    } else {
      return null
    }
  }

  submitValuesAction(formValues: IContactFormData) {
    const {props: p} = this
    p.requestSubmitFormValues(formValues)
  }

  // timeoutPlaceholder() {
  //   const {props: p} = this
  //   setTimeout(() => {
  //     p.setIsSubmitPending(false)
  //   }, 800)
  // }
}

export const ContactUsForm = connect<IProps, ActionCreators, RouteComponentProps<any>>(
  mapStateToProps,
  actionCreators,
)(ContactUsFormClass)
