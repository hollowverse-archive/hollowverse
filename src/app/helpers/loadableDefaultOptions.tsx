import React from 'react';
import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { CommonOptions } from 'react-loadable';

export const loadableDefaultOptions: CommonOptions = {
  loading({ pastDelay }) {
    if (pastDelay) {
      return <LoadingSpinner />;
    }

    return null;
  },
  delay: 200,
};
