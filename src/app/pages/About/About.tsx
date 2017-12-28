import * as React from 'react';
import { Footer } from 'components/Footer/Footer';
import { TextPage } from 'components/TextPage/TextPage';

export const About = () => (
  <TextPage>
    <h2>About</h2>
    <p>
      It is often said that one should avoid discussing politics or religion in
      polite company. But these are some of the most interesting topics and I
      hope I can get you talking about them!
    </p>
    <p>
      Email me at <a href="mailto:msafi@msafi.com">msafi@msafi.com</a> if you’d
      like to discuss anything.
    </p>
    <Footer />
  </TextPage>
);
