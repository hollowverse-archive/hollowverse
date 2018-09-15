import React from 'react';
import random from 'lodash/random';
import times from 'lodash/times';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Quote } from 'components/Quote/Quote';
import { createPulseAnimation } from 'helpers/animations';

export const LoadingEventsPlaceholder = withStyles((theme: Theme) => {
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
      <Card key={i}>
        <CardHeader
          avatar={<Avatar className={classes.photo} />}
          title={
            <span className={classes.text}>{'#'.repeat(random(10, 25))}</span>
          }
          subheader={
            <span className={classes.text}>{'#'.repeat(random(10, 25))}</span>
          }
        />
        <CardContent>
          <Quote size="large">
            <Typography paragraph>
              <span className={classes.text}>{'#'.repeat(random(10, 25))}</span>
            </Typography>
          </Quote>
          <Table padding="dense">
            <TableBody>
              {times(3).map(j => (
                <TableRow key={j}>
                  <TableCell>
                    <span className={classes.text}>
                      {'#'.repeat(random(10, 25))}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className={classes.text}>
                      {'#'.repeat(random(10, 25))}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    ))}
  </List>
));
