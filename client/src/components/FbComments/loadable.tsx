import * as React from 'react';
import Loadable from 'react-loadable';
import { importGlobalScript } from 'helpers/importGlobalScript';

export const LoadableFbComments = Loadable({
  async loader() {
    await importGlobalScript(
      'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10',
    );

    return import('./index');
  },

  loading: () => <div>Loading...</div>,
});
