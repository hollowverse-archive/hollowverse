import * as React from 'react';

import defaultLoadingIconUrl from 'assets/spinner.svg';

type Props = {
  loadingIconUrl?: string;
  size?: number;
};

export const LoadingSpinner = ({
  size = 50,
  loadingIconUrl = defaultLoadingIconUrl,
}: Props) => (
  <img src={loadingIconUrl} height={size} role="presentation" alt={undefined} />
);
