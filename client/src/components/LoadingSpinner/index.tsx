import * as React from 'react';

import defaultLoadingIcon from 'file-loader!assets/spinner.svg';

type Props = {
  loadingIcon?: string;
  size?: number;
};

export const LoadingSpinner = ({
  size = 50,
  loadingIcon = defaultLoadingIcon,
}: Props) => (
  <img height={size} src={loadingIcon} role="presentation" alt={undefined} />
);
