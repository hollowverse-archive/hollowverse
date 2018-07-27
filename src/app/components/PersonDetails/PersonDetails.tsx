import React from 'react';
import { prettifyUrl } from 'helpers/prettifyUrl';
import Helmet from 'react-helmet-async';
import cc from 'classcat';
import classes from './PersonDetails.module.scss';
import emptySvg from '!!url-loader!assets/emptySvg.svg';

import { PersonPhoto } from 'components/PersonPhoto/PersonPhoto';
import Typography from '@material-ui/core/Typography';

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

export class PersonDetails extends React.PureComponent<PersonDetailsProps> {
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
    const { photo, name, isLoading } = this.props;

    if (photo && photo.sourceUrl) {
      return (
        <a
          className={classes.photoLink}
          href={photo.sourceUrl}
          title={`Image source: ${prettifyUrl(photo.sourceUrl)}`}
        >
          <PersonPhoto className={classes.photo} src={photo.url} alt={name} />
          <span className="sr-only">
            Image source: {prettifyUrl(photo.sourceUrl)}
          </span>
        </a>
      );
    } else if (isLoading || !photo) {
      return (
        <span className={classes.photoLink}>
          <PersonPhoto
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
    const { summary, name } = this.props;

    return (
      <div className={classes.content}>
        <Typography align="center" variant="display1">
          <Typography align="center" variant="subheading" component="span">
            <span className={classes.text}>
              Religion, politics, and ideas of
            </span>
          </Typography>
          <span className={classes.text}>{name}</span>
        </Typography>
        {summary && (
          <div className={classes.summary}>
            {summary.split('\n').map(paragraph => (
              <Typography variant="body2" paragraph key={paragraph}>
                <span className={classes.text}>{paragraph}</span>
              </Typography>
            ))}
          </div>
        )}
      </div>
    );
  };

  render() {
    return (
      <div
        aria-hidden={this.props.isLoading}
        className={cc([
          classes.root,
          { [classes.isLoading]: this.props.isLoading },
        ])}
      >
        <div
          className={cc([
            classes.container,
            { [classes.isLoading]: this.props.isLoading },
          ])}
        >
          {this.renderHead()}
          {this.renderImage()}
          {this.renderContent()}
        </div>
      </div>
    );
  }
}
