import React from 'react';
import random from 'lodash/random';
import times from 'lodash/times';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';

import { createPulseAnimation } from 'helpers/animations';

export const LoadingListPlaceholder = withStyles((theme: Theme) => {
  const pulse = createPulseAnimation(theme);

  return createStyles({
    ...pulse.definition,
    root: {
      color: 'transparent',
      ...pulse.usage,
    },
    photo: pulse.photoProps,
    text: pulse.textProps,
  });
})(({ classes }) => (
  <List aria-hidden className={classes.root}>
    {times(random(2, 5), i => (
      <ListItem key={i}>
        <Avatar className={classes.photo} />
        <ListItemText
          aria-hidden
          primary={
            <span className={classes.text}>{'#'.repeat(random(10, 25))}</span>
          }
          secondary={
            <span className={classes.text}>{'#'.repeat(random(10, 25))}</span>
          }
        />
      </ListItem>
    ))}
  </List>
));
