import * as React from 'react';

// import defaultLoadingIcon from 'file-loader!assets/spinner.svg';

type Props = {
  loadingIcon?: string;
  size?: number;
};

export const LoadingSpinner = ({
  size = 50,
}: // loadingIcon = '',
Props) => <img height={size} role="presentation" alt={undefined} />;
