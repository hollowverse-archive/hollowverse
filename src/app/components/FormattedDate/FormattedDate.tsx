import React from 'react';
import formatDate from 'date-fns/format';

export const FormattedDate = ({
  dateString,
  format = 'MMMM D, YYYY',
}: {
  dateString?: string | null;
  format?: string;
}) => {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);

  return <time dateTime={date.toISOString()}>{formatDate(date, format)}</time>;
};
