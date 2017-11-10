import * as React from 'react';
import Loadable from 'react-loadable';
import { importGlobalScript } from 'helpers/importGlobalScript';
import { MessageWithIcon } from 'components/MessageWithIcon';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { SvgIcon } from 'components/SvgIcon';

import warningIcon from 'icons/warning.svg';

export const LoadableFbComments = Loadable({
  async loader() {
    try {
      await importGlobalScript(
        'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10',
      );
    } catch {
      throw new Error();
    }

    return import('./index');
  },

  loading: props => {
    if (props.error) {
      return (
        <MessageWithIcon
          caption="Error loading Facebook comments"
          icon={<SvgIcon {...warningIcon} size={50} />}
        />
      );
    }

    return (
      <MessageWithIcon
        caption="Loading Facebook comments..."
        icon={<LoadingSpinner size={50} />}
      />
    );
  },
});
