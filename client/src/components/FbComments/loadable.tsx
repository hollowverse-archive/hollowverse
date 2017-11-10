import * as React from 'react';
import Loadable from 'react-loadable';
import { importGlobalScript } from 'helpers/importGlobalScript';
import { MessageWithIcon } from 'components/MessageWithIcon';
import { LoadingSpinner } from 'components/LoadingSpinner';

export const LoadableFbComments = Loadable({
  async loader() {
    await importGlobalScript(
      'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10',
    );

    return import('./index');
  },

  loading: () => (
    <MessageWithIcon
      caption="Loading Facebook comments..."
      icon={<LoadingSpinner />}
    />
  ),
});
