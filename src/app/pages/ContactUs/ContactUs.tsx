import React from 'react';
import { Footer } from 'components/Footer/Footer';
import { TextPage } from 'components/TextPage/TextPage';

const CONTACT_EMAIL = 'hello@hollowverse.com';
const GITHUB_URL = 'https://github.com/hollowverse';
const DISCORD_URL =
  'https://discordapp.com/channels/308394001789353985/308394051114237952';

export const ContactUs = () => (
  <TextPage>
    <h1>Contact Us</h1>
    <p>
      It is often said that one should avoid discussing politics or religion in
      polite company. But these are some of the most interesting topics and we
      hope to get you talking about them!
    </p>
    <p>
      Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> if
      you'd like to discuss anything.
    </p>
    <p>
      You can also join us on <a href={DISCORD_URL}>Discord</a> chat.
    </p>
    <p>
      All of our website code is publicly available on{' '}
      <a href={GITHUB_URL}>GitHub</a>.
    </p>
    <Footer />
  </TextPage>
);
