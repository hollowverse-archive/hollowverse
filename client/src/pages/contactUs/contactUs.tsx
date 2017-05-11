import * as React from 'react'
import {connect} from 'react-redux'

class ContactUs extends React.Component<undefined, undefined> {
  render() {
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
          />
        </label>
        <label>
          <textarea
            placeholder='Your Message'
            id='message'
            name='userMessage'
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
}

export default connect()(ContactUs)
