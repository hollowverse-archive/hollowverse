import * as React from 'react';
import Loadable from 'react-loadable';
import { importGlobalScript } from 'helpers/importGlobalScript';
import { MessageWithIcon } from 'components/MessageWithIcon';
import { SvgIcon } from 'components/SvgIcon';

import warningIcon from 'icons/warning.svg';
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
      icon={<SvgIcon {...warningIcon} size={100} />}
    />
  ),
});
