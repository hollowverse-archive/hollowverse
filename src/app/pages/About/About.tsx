import React from 'react';
import { Footer } from 'components/Footer/Footer';
import { TextPage } from 'components/TextPage/TextPage';

export const About = () => (
  <TextPage>
    <h1>About</h1>
    <p>
      It is often said that one should avoid discussing politics or religion in
      polite company. But these are some of the most interesting topics and I
      hope I can get you talking about them!
    </p>
    <p>
      Email us at{' '}
      <a href="mailto:hello@hollowverse.com">hello@hollowverse.com</a> if you’d
      like to discuss anything.
    </p>
    <Footer />
  </TextPage>
);
