import React from 'react';
import { Image } from 'components/Image/Image';
import classes from './PersonDetails.module.scss';
import { prettifyUrl } from 'helpers/prettifyUrl';
import Helmet from 'react-helmet-async';
import { oneLineTrim } from 'common-tags';
import cc from 'classcat';
import emptySvg from '!!url-loader!assets/emptySvg.svg';

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

  renderCoverBackground = () => {
    const { photo, isLoading } = this.props;

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

  renderImage = () => {
    const { photo, name, isLoading } = this.props;

    if (photo && photo.sourceUrl) {
      return (
        <a
          className={classes.photoLink}
          href={photo.sourceUrl}
          title={`Image source: ${prettifyUrl(photo.sourceUrl)}`}
        >
          <Image className={classes.photo} src={photo.url} alt={name} />
          <span className="sr-only">
            Image source: {prettifyUrl(photo.sourceUrl)}
          </span>
        </a>
      );
    } else if (isLoading) {
      return (
        <span className={classes.photoLink}>
          <Image className={classes.photo} src={emptySvg} alt={name} />
        </span>
      );
    }

    return null;
  };

  renderContent = () => {
    const { summary, name } = this.props;

    return (
      <div className={classes.content}>
        <h1 className={classes.nameContainer}>
          <div className={classes.caption}>
            <span className={classes.text}>
              Religion, politics, and ideas of
            </span>
          </div>
          <div className={classes.name}>
            <span className={classes.text}>{name}</span>
          </div>
        </h1>
        {summary && (
          <div className={classes.summary}>
            {summary.split('\n').map(paragraph => (
              <p key={paragraph}>
                <span className={classes.text}>{paragraph}</span>
              </p>
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
        {this.renderCoverBackground()}
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
