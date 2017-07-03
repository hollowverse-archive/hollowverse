import { css } from 'aphrodite/no-important';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { IContactFormData } from '../../../../typings/typeDefinitions';
import { common } from '../../common.styles';
import { Form } from '../../components/form';
import { GlobalSpinner } from '../../components/globalSpinner';
import { Input } from '../../components/input';
import { actions } from '../../store/actions';
import { State } from '../../store/reducers';
import { hasName, hasSentence, isValidEmail } from '../../utils/utils';
import pick from 'lodash/pick';
import { styles } from './contactUsForm.styles';

interface StateProps {
  emailHasBlur: boolean;
  nameHasBlur: boolean;
  messageHasBlur: boolean;
  emailInputValue: string;
  nameInputValue: string;
  messageInputValue: string;
  isSubmitPending: boolean;
  submitSuccess: boolean;
  submitFail: boolean;
}

function mapStateToProps(state: State): StateProps {
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
      'submitFail',
    ]),
  };
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
  'setSubmitFail',
  'requestSubmitFormValues',
]);

type ActionCreators = typeof actionCreators;
type IProps = ActionCreators & StateProps & RouteComponentProps<any>;

class ContactUsFormClass extends React.Component<IProps, {}> {
  render() {
    const { props: p } = this;
    const emailInputValid = this.emailInputValidation();
    const nameInputValid = this.nameInputValidation();
    const messageInputValid = this.messageInputValidation();
    const submitSuccessTrue = this.submitSuccessValidation();

    return (
      <div className={css(styles.pageContactForm)}>
        <GlobalSpinner />
        {p.submitSuccess
          ? <div className={css(styles.messageSuccess)}>
              Your message was sent successfully. We'll get back with you soon!
            </div>
          : ''}
        <div className={css(styles.formContainer, submitSuccessTrue)}>
          <h1 className={css(common.titleTypography, styles.formTitle)}>
            Contact us
          </h1>
          <Form onSubmit={this.handleFormSubmit} noValidate>
            <label className={css(common.textTypography, styles.contactForm)}>
              Email:
            </label>
            <Input
              className={css(
                common.textTypography,
                styles.formInput,
                emailInputValid,
              )}
              type="email"
              value={p.emailInputValue}
              onTextChange={this.handleEmailInputChange}
              onBlur={this.onEmailBlur}
            />
            <label className={css(common.textTypography, styles.contactForm)}>
              Name:
            </label>
            <Input
              className={css(
                common.textTypography,
                styles.formInput,
                nameInputValid,
              )}
              type="text"
              value={p.nameInputValue}
              onTextChange={this.handleNameInputChange}
              onBlur={this.onNameBlur}
            />
            <label className={css(common.textTypography, styles.contactForm)}>
              Message:
            </label>
            <textarea
              className={css(
                common.textTypography,
                styles.formInput,
                styles.textArea,
                messageInputValid,
              )}
              value={p.messageInputValue}
              onChange={this.handleMessageInputChange}
              onBlur={this.onMessageBlur}
            />
            {p.submitFail
              ? <div className={css(styles.submitFail)}>
                  Something went wrong,<br />please try again!
                </div>
              : ''}
            <div className={css(styles.submitButtonContainer)}>
              <input
                className={css(
                  common.textTypography,
                  common.palette,
                  styles.submitButton,
                )}
                disabled={
                  !isValidEmail(p.emailInputValue) ||
                  !hasName(p.nameInputValue) ||
                  !hasSentence(p.messageInputValue)
                }
                type="submit"
                value="Send"
              />
            </div>
          </Form>
        </div>
      </div>
    );
  }

  onEmailBlur = (_: any) => {
    const { props: p } = this;
    p.setEmailHasBlur(true);
  };

  onNameBlur = (_: any) => {
    const { props: p } = this;
    p.setNameHasBlur(true);
  };

  onMessageBlur = (_: any) => {
    const { props: p } = this;
    p.setMessageHasBlur(true);
  };

  emailInputValidation = () => {
    const { props: p } = this;
    if (p.emailHasBlur === true) {
      return !isValidEmail(p.emailInputValue)
        ? styles.invalidInput
        : styles.validInput;
    } else {
      return null;
    }
  };

  nameInputValidation = () => {
    const { props: p } = this;
    if (p.nameHasBlur === true) {
      return !hasName(p.nameInputValue)
        ? styles.invalidInput
        : styles.validInput;
    } else {
      return null;
    }
  };

  messageInputValidation = () => {
    const { props: p } = this;
    if (p.messageHasBlur === true) {
      return !hasSentence(p.messageInputValue)
        ? styles.invalidInput
        : styles.validInput;
    } else {
      return null;
    }
  };

  handleEmailInputChange = (emailText: string) => {
    const { props: p } = this;
    p.setEmailInputValue(emailText);
  };

  handleNameInputChange = (nameText: string) => {
    const { props: p } = this;
    p.setNameInputValue(nameText);
  };

  handleMessageInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { target: { value: messageText } } = event;
    const { props: p } = this;
    p.setMessageInputValue(messageText);
  };

  handleFormSubmit = () => {
    const { props: p } = this;
    this.submitValuesAction({
      email: p.emailInputValue,
      name: p.nameInputValue,
      message: p.messageInputValue,
    });

    p.setEmailHasBlur(false);
    p.setNameHasBlur(false);
    p.setMessageHasBlur(false);
  };

  submitSuccessValidation = () => {
    const { props: p } = this;
    if (p.submitSuccess === true) {
      return styles.hide;
    } else {
      return null;
    }
  };

  submitValuesAction = (formValues: IContactFormData) => {
    const { props: p } = this;
    p.requestSubmitFormValues(formValues);
  };
}

export const ContactUsForm = connect<IProps, StateProps, ActionCreators>(
  mapStateToProps,
  actionCreators,
)(ContactUsFormClass);
