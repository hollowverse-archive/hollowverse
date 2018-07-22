import React from 'react';
import { CommonOptions } from 'react-loadable';
import CircularProgress from '@material-ui/core/CircularProgress';

export const loadableDefaultOptions: CommonOptions = {
  loading({ pastDelay }) {
    if (pastDelay) {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={50} />
        </div>
      );
    }

    return null;
  },
  delay: 200,
};
