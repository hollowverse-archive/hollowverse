import React from 'react';
import { prettifyUrl } from 'helpers/prettifyUrl';
import Helmet from 'react-helmet-async';
import cc from 'classcat';
import emptySvg from '!!url-loader!assets/emptySvg.svg';

import { PersonPhoto } from 'components/PersonPhoto/PersonPhoto';
import Typography from '@material-ui/core/Typography';
import { oneLineTrim } from 'common-tags';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';

type PersonDetailsProps = {
  summary: string | null;
  name: string;
  photo: {
    url: string;
    sourceUrl: string;
    colorPalette: {
      vibrant: string | null;
      darkVibrant: string | null;
      muted: string | null;
      darkMuted: string | null;
    } | null;
  } | null;
  isLoading: boolean;
};

// tslint:disable-next-line max-func-body-length
const styles = (theme: Theme) =>
  createStyles({
    '@keyframes pulse-animation': {
      '0%, 100%': {
        opacity: 0.2,
      },

      '50%': {
        opacity: 1,
      },
    },

    root: {
      display: 'flex',
      flexDirection: 'column',
      '&$isLoading $text, &$isLoading $photo': {
        color: 'transparent',
        background: theme.palette.divider,
        userSelect: 'none',
      },
      '&$isLoading $text': {
        borderRadius: theme.shape.borderRadius,
      },
      '&$isLoading::after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        opacity: 0.2,
        filter: 'blur(50px)',
        backgroundImage: `
        linear-gradient(
          -180deg,
          rgba(241, 241, 243, 0) 0%,
          rgba(241, 241, 243, 1) 50%
        ),
        linear-gradient(
          132deg,
          #4cfde9 0%,
          rgba(251, 201, 84, 1) 50%,
          #4435f7 100%
        )`,
      },
    },

    isLoading: {
      animation: `pulse-animation ${theme.transitions.duration.standard *
        3}ms ${theme.transitions.easing.easeInOut} infinite`,
      animationFillMode: 'both',
    },

    coverBackgroundWrapper: {
      maskImage: 'linear-gradient(to bottom, black, transparent)',
      maskRepeat: 'no-repeat',
      maskSize: '100% 100%',
      border: '1px solid transparent',
      borderTop: 'none',
      position: 'absolute',
      right: 0,
      left: 0,
      top: 0,
      height: 200,
      zIndex: -1,
    },

    coverBackground: {
      filter: 'blur(25px)',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },

    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      alignSelf: 'center',
    },

    content: {
      width: '100%',
      alignSelf: 'center',
      marginTop: theme.spacing.unit * 2,
    },

    photoLink: {
      alignSelf: 'center',
      display: 'inline-block',
      maxWidth: theme.breakpoints.values.sm / 4,
      maxHeight: theme.breakpoints.values.sm / 4,
      height: '25vw',
      width: '25vw',
      minWidth: 120,
      minHeight: 120,
      marginTop: theme.spacing.unit * 5,
    },

    photo: {
      boxShadow: `0 0 0 1.5px ${theme.palette.background.default}`,
      borderRadius: 1,
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.background.default,
      objectFit: 'cover',
    },

    text: {},

    name: {
      color: theme.palette.text.primary,
    },

    summary: {
      padding: theme.spacing.unit * 2,
    },
  });

type Props = PersonDetailsProps & WithStyles<ReturnType<typeof styles>>;

export const PersonDetails = withStyles(styles)(
  class extends React.PureComponent<Props> {
    renderHead = () => {
      const { photo } = this.props;

      return photo &&
        photo.colorPalette &&
        photo.colorPalette.darkVibrant !== null ? (
        <Helmet>
          <meta name="theme-color" content={photo.colorPalette.darkVibrant} />
        </Helmet>
      ) : null;
    };

    renderImage = () => {
      const { photo, name, isLoading, classes } = this.props;

      if (photo && photo.sourceUrl) {
        return (
          <a
            className={classes.photoLink}
            href={photo.sourceUrl}
            title={`Image source: ${prettifyUrl(photo.sourceUrl)}`}
          >
            <PersonPhoto
              isLazy={false}
              className={classes.photo}
              src={photo.url}
              alt={name}
            />
            <span className="sr-only">
              Image source: {prettifyUrl(photo.sourceUrl)}
            </span>
          </a>
        );
      } else if (isLoading || !photo) {
        return (
          <span className={classes.photoLink}>
            <PersonPhoto
              isLazy={false}
              className={classes.photo}
              src={isLoading ? emptySvg : undefined}
              alt={undefined}
              role="presentation"
            />
          </span>
        );
      }

      return null;
    };

    renderContent = () => {
      const { summary, name, classes } = this.props;

      return (
        <div className={classes.content}>
          <Typography gutterBottom align="center" variant="display1">
            <Typography
              style={{
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontSize: 11,
              }}
              align="center"
              variant="caption"
              component="small"
            >
              <span className={classes.text}>
                Religion, politics, and ideas of
              </span>
            </Typography>
            <span className={cc([classes.text, classes.name])}>{name}</span>
          </Typography>
          {summary && (
            <div className={classes.summary}>
              {summary.split('\n').map(paragraph => (
                <Typography variant="body1" paragraph key={paragraph}>
                  <span className={classes.text}>{paragraph}</span>
                </Typography>
              ))}
            </div>
          )}
        </div>
      );
    };

    renderCoverBackground = () => {
      const { photo, isLoading, classes } = this.props;
      if (isLoading) {
        return null;
      }

      let colors: string[] = [];
      if (photo && photo.colorPalette) {
        const { vibrant, muted, darkVibrant, darkMuted } = photo.colorPalette;
        colors = [darkVibrant || darkMuted, vibrant || muted].filter(
          color => color !== null,
        ) as string[];
      }

      return (
        <div className={classes.coverBackgroundWrapper} aria-hidden>
          <div
            className={classes.coverBackground}
            style={
              colors.length === 2
                ? {
                    background: oneLineTrim`linear-gradient(
                    130deg,
                    #4cfde9 -20%,
                    transparent 30%,
                    transparent 60%,
                    rgb(253, 188, 9) 85%
                  ) no-repeat,
                  linear-gradient(
                    130deg,
                    transparent -20%,
                    ${colors[0]} 30%,
                    ${colors[1]} 60%,
                    transparent 85%
                  ) no-repeat`,
                  }
                : undefined
            }
          />
        </div>
      );
    };

    render() {
      const { classes } = this.props;

      return (
        <div
          aria-hidden={this.props.isLoading}
          className={cc([
            classes.root,
            { [classes.isLoading]: this.props.isLoading },
          ])}
        >
          {this.renderCoverBackground()}
          <div className={classes.container}>
            {this.renderHead()}
            {this.renderImage()}
            {this.renderContent()}
          </div>
        </div>
      );
    }
  },
);
